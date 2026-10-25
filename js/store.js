// データアクセス層。画面(app.js)はここのAPIだけを使う。
// バックエンド導入時は、この中身を fetch('/api/...') に置き換えれば画面側はほぼそのまま使える。
window.Store = (() => {
  'use strict';
  const D = window.AW_DATA, RULES = window.AW_RULES;
  const VKEY = 'aw.videos.v1';

  function readOverrides() {
    try { return JSON.parse(localStorage.getItem(VKEY)) || {}; } catch (e) { return {}; }
  }
  function writeOverrides(o) {
    try { localStorage.setItem(VKEY, JSON.stringify(o)); return true; } catch (e) { return false; }
  }

  const classList = D.classes;
  const classMap = new Map(classList.map((c) => [c.id, c]));
  const classIdx = (id) => classList.findIndex((c) => c.id === id);
  const roundMap = new Map(D.rounds.map((r) => [r.id, r]));
  const countryMap = new Map((D.countries || []).map((c) => [c.id, c]));
  const tournamentList = [...D.tournaments].sort((x, y) => y.date.localeCompare(x.date));
  const tournamentMap = new Map(tournamentList.map((t) => [t.id, t]));

  // 一覧で新しい試合が上に来るための並び順（大きいほど後の試合）
  const ROUND_SORT = { Q: 0, W: 100, WF: 200, L: 300, LF: 400, F: 500, F2: 501 };

  // ---- 部門と試合を組み立て ----
  const divisions = [];
  const allMatches = [];
  for (const t of D.tournaments) {
    for (const d of t.divisions) {
      const key = `${t.id}-${d.classId}-${d.arm}`;
      // 不戦（シード）で試合のない回戦を詰めて、回戦番号を1から振り直す
      const renum = {};
      for (const r of ['W', 'L', 'Q']) {
        const nos = [...new Set((d.matches || []).filter((m) => m.round === r).map((m) => m.no))].sort((x, y) => x - y);
        renum[r] = new Map(nos.map((no, i) => [no, i + 1]));
      }
      const ms = (d.matches || []).map((m0, i) => {
        const m = renum[m0.round] ? { ...m0, no: renum[m0.round].get(m0.no) } : m0;
        const r = roundMap.get(m.round) || { name: m.round };
        return {
          ...m,
          id: m.id || `${key}-${i + 1}`,
          detail: m.detail || (D.details || {})[m.id || `${key}-${i + 1}`],
          tournamentId: t.id, date: t.date, classId: d.classId, arm: d.arm, format: d.format, divKey: key,
          loser: m.winner === m.a ? m.b : m.a,
          roundName: r.name,
          // label を書いた試合はその表記を優先（例: 敗者復活戦準決勝）
          label: m.label || (['W', 'L', 'Q'].includes(m.round) && m.no ? `${r.name} ${m.no}回戦` : r.name),
          customLabel: !!m.label,
          sortKey: (ROUND_SORT[m.round] || 0) + (m.no || 0),
        };
      });
      const div = { key, tournamentId: t.id, date: t.date, classId: d.classId, arm: d.arm, format: d.format, final: !!d.final, entries: d.entries, matches: ms, incomplete: !!d.incomplete, note: d.note || '' };
      div.standings = computeStandings(div);
      divisions.push(div);
      allMatches.push(...ms);
    }
  }
  allMatches.sort((x, y) =>
    y.date.localeCompare(x.date) ||
    classIdx(x.classId) - classIdx(y.classId) ||
    (x.arm === y.arm ? 0 : x.arm === 'R' ? -1 : 1) ||
    y.sortKey - x.sortKey ||
    (x.slot || 0) - (y.slot || 0));
  const matchMap = new Map(allMatches.map((m) => [m.id, m]));
  const divMap = new Map(divisions.map((d) => [d.key, d]));

  // 上位3名
  function computeStandings(div) {
    const find = (r) => div.matches.find((m) => m.round === r);
    let top = [];
    if (div.format === 'league') {
      const table = RULES.leagueTable(div.entries, div.matches);
      const f = find('F');
      if (f) {
        top = [f.winner, f.loser];
        const third = table.find((r) => !top.includes(r.athleteId));
        if (third) top.push(third.athleteId);
      } else {
        top = table.slice(0, 3).map((r) => r.athleteId);
      }
    } else {
      // 決勝が未登録でも、敗者復活戦決勝があれば3位だけは確定する
      // 決勝1回戦目を敗者復活戦側が勝った場合は2回戦目で決まるため、2回戦目が未登録なら1・2位は未確定
      const wf = find('WF');
      const f1 = find('F');
      const f2 = find('F2');
      const f = f2 || (f1 && (!wf || f1.winner === wf.winner) ? f1 : null);
      const lf = find('LF');
      const res = [];
      if (f) res.push({ athleteId: f.winner, place: 1 }, { athleteId: f.loser, place: 2 });
      if (lf) res.push({ athleteId: lf.loser, place: 3 });
      return res;
    }
    if (!div.matches.length) return [];
    return top.map((athleteId, i) => ({ athleteId, place: i + 1 }));
  }

  const placements = divisions.flatMap((d) => d.standings.map((s) => ({ ...s, tournamentId: d.tournamentId, classId: d.classId, arm: d.arm })));

  // ---- 選手（出場記録から利き腕・階級・体重を判定） ----
  const athleteList = D.athletes.map((a) => {
    const arms = new Set(), classIds = new Set();
    let latest = null;
    for (const d of divisions) {
      if (!d.entries.includes(a.id)) continue;
      arms.add(d.arm);
      classIds.add(d.classId);
      if (!latest || d.date > latest.date) latest = d;
    }
    const byClassIdx = (x, y) => classIdx(x) - classIdx(y);
    // 直近の大会で出場した階級（同じ大会で複数階級に出場する場合あり）
    const latestClassIds = latest
      ? [...new Set(divisions.filter((d) => d.tournamentId === latest.tournamentId && d.entries.includes(a.id)).map((d) => d.classId))].sort(byClassIdx)
      : [];
    const weights = tournamentList
      .filter((t) => t.weighIns && t.weighIns[a.id] != null)
      .map((t) => ({ tournamentId: t.id, date: t.date, kg: t.weighIns[a.id] }));
    return {
      ...a,
      nicknames: [].concat(a.nickname || []).filter(Boolean), // あだ名は文字列でも配列でも可
      countryName: (countryMap.get(a.nationality) || { name: a.nationality || '' }).name,
      arms: [...arms],
      dominant: arms.size === 2 ? 'B' : arms.has('R') ? 'R' : arms.has('L') ? 'L' : null,
      classIds: [...classIds].sort(byClassIdx),
      latestClassId: latestClassIds[0] || null,
      latestClassIds,
      latestWeight: weights.length ? weights[0].kg : null,
    };
  });
  const athleteMap = new Map(athleteList.map((a) => [a.id, a]));

  function videoOf(id) {
    const ov = readOverrides();
    const v = Object.prototype.hasOwnProperty.call(ov, id) ? ov[id] : D.videos[id];
    if (!v || !v.url) return null;
    const start = v.start || 0;
    return { url: v.url, start, end: v.end > start ? v.end : null, local: !!ov[id] };
  }
  const withVideo = (m) => ({ ...m, video: videoOf(m.id) });

  // ---- 公開API ----
  function matches(f = {}) {
    return allMatches
      .filter((m) =>
        (!f.tournamentId || m.tournamentId === f.tournamentId) &&
        (!f.classId || m.classId === f.classId) &&
        (!f.arm || m.arm === f.arm) &&
        (!f.round || m.round === f.round) &&
        (!f.divKey || m.divKey === f.divKey) &&
        (!f.athleteId || m.a === f.athleteId || m.b === f.athleteId) &&
        (!f.opponentId || m.a === f.opponentId || m.b === f.opponentId))
      .map(withVideo)
      .filter((m) => !f.withVideo || m.video);
  }

  function division(key) {
    const d = divMap.get(key);
    return d && { ...d, matches: matches({ divKey: key }) };
  }
  function divisionsOf(tournamentId) {
    return divisions
      .filter((d) => d.tournamentId === tournamentId)
      .sort((x, y) => classIdx(x.classId) - classIdx(y.classId) || (x.arm === y.arm ? 0 : x.arm === 'R' ? -1 : 1));
  }
  // この大会で複数の階級に出場した選手 [{ athleteId, classIds }]
  function multiClassEntrants(tournamentId) {
    const map = new Map();
    for (const d of divisions) {
      if (d.tournamentId !== tournamentId) continue;
      for (const id of d.entries) {
        if (!map.has(id)) map.set(id, new Set());
        map.get(id).add(d.classId);
      }
    }
    return [...map.entries()]
      .filter(([, set]) => set.size > 1)
      .map(([athleteId, set]) => ({ athleteId, classIds: [...set].sort((x, y) => classIdx(x) - classIdx(y)) }));
  }

  function leagueTable(key) {
    const d = divMap.get(key);
    return d ? RULES.leagueTable(d.entries, d.matches) : [];
  }

  // 試合詳細: fouls / warnings は [a, b] または { 選手ID: 数 }
  const filled = (v) => v != null && v !== '';
  const yes = (v) => filled(v) && v !== 'なし' && v !== false && v !== 0;
  const detailPair = (m, p) => (!p ? [] : Array.isArray(p) ? p : [p[m.a], p[m.b]]);
  function hasDetail(m) {
    const d = m.detail || {};
    return [...detailPair(m, d.fouls), ...detailPair(m, d.warnings), d.strapRequest, d.strap, d.refereeGrip].some(filled);
  }
  // 選手ごとの試合詳細の集計（分母は詳細記載のある試合数）
  function detailStats(id, ms) {
    const r = { total: ms.length, recorded: 0, fouls: 0, warnings: 0, strapRequests: 0, straps: 0, refereeGrips: 0 };
    for (const m of ms.filter(hasDetail)) {
      const d = m.detail, side = m.a === id ? 0 : 1;
      r.recorded++;
      r.fouls += Number(detailPair(m, d.fouls)[side]) || 0;
      r.warnings += Number(detailPair(m, d.warnings)[side]) || 0;
      // ストラップ申請は 'あり' / 'なし' のほか、申請した選手ID や [a, b] / { 選手ID: true } でも指定可
      const sr = d.strapRequest;
      if (typeof sr === 'object' && sr ? yes(detailPair(m, sr)[side]) : sr === m.a || sr === m.b ? sr === id : yes(sr)) r.strapRequests++;
      if (yes(d.strap)) r.straps++;
      if (yes(d.refereeGrip)) r.refereeGrips++;
    }
    return r;
  }

  function athleteStats(id, arm) {
    const ms = matches({ athleteId: id, arm });
    const s = { wins: 0, losses: 0, pins: 0, byArm: { R: { w: 0, l: 0 }, L: { w: 0, l: 0 } } };
    const opp = new Map();
    for (const m of ms) {
      const won = m.winner === id;
      const o = m.a === id ? m.b : m.a;
      const rec = opp.get(o) || { athleteId: o, w: 0, l: 0 };
      if (won) { s.wins++; s.byArm[m.arm].w++; rec.w++; if (m.method === 'ピン勝ち') s.pins++; }
      else { s.losses++; s.byArm[m.arm].l++; rec.l++; }
      opp.set(o, rec);
    }
    s.total = s.wins + s.losses;
    const mine = placements.filter((p) => p.athleteId === id && (!arm || p.arm === arm));
    s.titles = mine.filter((p) => p.place === 1).length;
    s.medals = mine.length;
    s.opponents = [...opp.values()].sort((x, y) => (y.w + y.l) - (x.w + x.l));
    s.matches = ms;
    s.detail = detailStats(id, ms);
    // 大会ごとの出場記録（計量体重・階級・腕別の順位）
    // 大会 × 階級 ごとに1行（同じ大会で複数階級に出場した場合は複数行）
    s.history = tournamentList.flatMap((t) => {
      const ds = divisions.filter((d) => d.tournamentId === t.id && d.entries.includes(id));
      const cids = [...new Set(ds.map((d) => d.classId))].sort((x, y) => classIdx(x) - classIdx(y));
      return cids.map((classId) => {
        const armRes = {};
        for (const d of ds.filter((x) => x.classId === classId)) {
          const p = d.standings.find((x) => x.athleteId === id);
          armRes[d.arm] = { place: p ? p.place : null, divKey: d.key };
        }
        return { tournament: t, weight: t.weighIns ? t.weighIns[id] : null, classId, arms: armRes, classCount: cids.length };
      });
    });
    return s;
  }

  function headToHead(a, b, arm) {
    const ms = matches({ athleteId: a, opponentId: b, arm });
    return { matches: ms, aWins: ms.filter((m) => m.winner === a).length, bWins: ms.filter((m) => m.winner === b).length };
  }

  const norm = (s) => String(s || '').toLowerCase().replace(/[\s　・]/g, '');
  function searchAthletes(kw, f = {}) {
    const k = norm(kw);
    return athleteList.filter((a) =>
      (!k || [a.name, a.nameEn, ...a.nicknames, a.team, a.countryName].some((x) => norm(x).includes(k))) &&
      (!f.classId || a.classIds.includes(f.classId)) &&
      (!f.arm || (f.arm === 'B' ? a.arms.length === 2 : a.arms.includes(f.arm))));
  }

  const weightOf = (tournamentId, athleteId) => {
    const t = tournamentMap.get(tournamentId);
    return t && t.weighIns ? t.weighIns[athleteId] : null;
  };

  function setVideo(id, url, start, end) {
    const ov = readOverrides();
    ov[id] = { url, start: start || 0 };
    if (end > (start || 0)) ov[id].end = end;
    return writeOverrides(ov);
  }
  function removeVideo(id) {
    const ov = readOverrides();
    if (D.videos[id]) ov[id] = { url: '' }; // data.js側の動画を非表示にする
    else delete ov[id];
    return writeOverrides(ov);
  }
  function exportVideos() {
    const out = { ...D.videos };
    for (const [k, v] of Object.entries(readOverrides())) {
      if (v.url) out[k] = v; else delete out[k];
    }
    return out;
  }

  return {
    classes: () => classList,
    cls: (id) => classMap.get(id),
    rounds: () => D.rounds,
    formatName: (f) => D.formats[f] || f,
    organizers: () => D.organizers || [],
    athletes: () => athleteList,
    athlete: (id) => athleteMap.get(id),
    tournaments: () => tournamentList,
    tournament: (id) => tournamentMap.get(id),
    divisionsOf, division, leagueTable, multiClassEntrants,
    matches,
    match: (id) => (matchMap.has(id) ? withVideo(matchMap.get(id)) : null),
    athleteStats, headToHead, searchAthletes, weightOf, hasDetail, detailPair, detailStats,
    setVideo, removeVideo, exportVideos,
  };
})();
