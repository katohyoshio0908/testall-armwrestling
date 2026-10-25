(() => {
  'use strict';
  const S = window.Store;
  const app = document.getElementById('app');

  // ---------- ユーティリティ ----------
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmtDate = (d) => d.replace(/-/g, '.');
  // 複数日開催の大会は「開始〜終了」で表示
  const fmtPeriod = (t) => (t.endDate && t.endDate !== t.date ? `${fmtDate(t.date)}〜${fmtDate(t.endDate)}` : fmtDate(t.date));
  const pad2 = (n) => String(n).padStart(2, '0');
  const fmtSec = (s) => (s >= 3600 ? `${Math.floor(s / 3600)}:${pad2(Math.floor(s / 60) % 60)}:${pad2(s % 60)}` : `${Math.floor(s / 60)}:${pad2(s % 60)}`);
  const pct = (w, t) => (t ? Math.round((w / t) * 100) : 0);
  const ARM = { R: '右腕', L: '左腕' };
  const DOMINANT = { R: '右', L: '左', B: '両' };
  const opt = (v, label, sel) => `<option value="${esc(v)}"${v === sel ? ' selected' : ''}>${esc(label)}</option>`;
  const kg = (w) => (w != null ? `${w.toFixed(1)}kg` : '-');
  const familyName = (a) => a.name.split(' ')[0];
  // 全員閲覧用の表記：苗字＋「選手」（日本人以外はアルファベット表記の姓）
  const publicName = (a) => `${isForeign(a) ? a.nameEn.split(' ').pop() : familyName(a)}選手`;

  function parseYouTube(url) {
    try {
      const u = new URL(url);
      let id = null;
      if (u.hostname === 'youtu.be') id = u.pathname.slice(1);
      else if (/(^|\.)youtube(-nocookie)?\.com$/.test(u.hostname)) {
        id = u.searchParams.get('v');
        if (!id) { const m = u.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]{11})/); id = m && m[1]; }
      }
      return id && /^[\w-]{11}$/.test(id) ? id : null;
    } catch (e) { return null; }
  }
  // "90" / "1:30" / "1m30s" → 秒
  function parseStart(str) {
    if (!str) return 0;
    str = String(str).trim();
    if (/^\d+$/.test(str)) return +str;
    if (/^\d+(:\d{1,2}){1,2}$/.test(str)) return str.split(':').reduce((acc, v) => acc * 60 + +v, 0);
    const m = str.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
    return m ? (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0) : 0;
  }
  function startFromUrl(url) {
    try { return parseStart(new URL(url).searchParams.get('t')); } catch (e) { return 0; }
  }

  // ---------- 共通パーツ ----------
  const photo = (a, size = 'sm', alt = '') => `<img class="photo ${size}" src="${esc(a.photo)}" alt="${esc(alt)}" loading="lazy">`;
  // 日本人以外: アルファベット表記がメイン、カタカナがサブ / 日本人: 漢字名のみ
  const isForeign = (a) => a.nationality !== 'JPN' && !!a.nameEn;
  const mainName = (a) => (isForeign(a) ? a.nameEn : a.name);
  const subName = (a) => (isForeign(a) ? a.name : '');
  // 選手一覧・選手ページの副表記（日本人はアルファベット、日本人以外はカタカナ）
  const altName = (a) => (isForeign(a) ? a.name : a.nameEn || '');
  // 名前の2段表示（日本人以外: アルファベット / その下にカタカナ）
  const nameLines = (a) => `<span class="nm"><strong>${esc(mainName(a))}</strong>${subName(a) ? `<span class="name-sub">${esc(subName(a))}</span>` : ''}</span>`;
  const athleteLink = (a) => `<a href="#/athletes/${a.id}">${esc(a.name)}</a>`;
  const chip = (text, cls = '') => `<span class="chip ${cls}">${esc(text)}</span>`;
  const armChip = (arm) => chip(ARM[arm], `arm-${arm}`);
  const roundChip = (m) => chip(m.label, ['F', 'F2'].includes(m.round) ? 'final' : ['WF', 'LF'].includes(m.round) ? 'semi' : '');
  const placeMark = (p) => `<span class="place p${p}">${p}</span>`;
  const empty = (msg) => `<div class="empty">${esc(msg)}</div>`;
  const quoted = (a) => a.nicknames.map((n) => `「${esc(n)}」`).join('');
  const nick = (a) => (a.nicknames.length ? `<span class="nick">${quoted(a)}</span>` : '');
  // 直近大会の出場階級（複数あれば全部）
  const classChips = (a) => a.latestClassIds.map((c) => chip(S.cls(c).name)).join('');
  const countryChip = (a) => (a.countryName ? chip(`国籍: ${a.countryName}`, 'country') : '');

  function matchRow(m, pov) {
    const t = S.tournament(m.tournamentId);
    const A = S.athlete(m.a), B = S.athlete(m.b);
    // 日本人以外はアルファベット表記を大きく、その下にカタカナを小さく
    const side = (x) => `<span class="mr-side ${m.winner === x.id ? 'win' : ''}">${photo(x, 'sm')}<span class="mr-name"><span>${esc(mainName(x))}</span>${subName(x) ? `<small class="name-sub">${esc(subName(x))}</small>` : ''}</span></span>`;
    const badge = pov ? (m.winner === pov ? '<span class="badge w">WIN</span>' : '<span class="badge l">LOSS</span>') : '';
    return `<a class="match-row" href="#/matches/${m.id}">
      ${badge}
      <span class="mr-meta">
        <span class="mr-date">${fmtDate(t.date)} ${esc(t.short)}</span>
        <span class="chips">${chip(S.cls(m.classId).name)}${armChip(m.arm)}${roundChip(m)}</span>
      </span>
      <span class="mr-vs">${side(A)}<span class="vs">VS</span>${side(B)}</span>
      <span class="mr-res">${esc(m.method)}</span>
      <span class="mr-video" title="${m.video ? '動画あり' : '動画なし'}">${m.video ? '▶' : ''}</span>
    </a>`;
  }
  const matchList = (ms, pov) => (ms.length ? `<div class="list">${ms.map((m) => matchRow(m, pov)).join('')}</div>` : empty('該当する試合はありません'));

  function videoPlayer(v) {
    if (!v) return `<div class="video placeholder"><div><div class="ph-icon">▶</div><p>この試合の動画はまだ登録されていません</p></div></div>`;
    const yt = parseYouTube(v.url);
    const range = `<span class="muted">再生範囲 ${fmtSec(v.start | 0)}〜${v.end ? fmtSec(v.end) : '最後まで'}</span>`;
    if (yt) {
      return `<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${yt}?start=${v.start | 0}${v.end ? `&end=${v.end | 0}` : ''}&rel=0" title="試合動画"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>
        <p class="video-alt small">${location.protocol === 'file:' ? '<span class="neg">ファイルを直接開いているため、埋め込み動画が再生できない場合があります（エラー153）。start.bat から開いてください。</span> ' : ''}${range} ・ <a href="https://www.youtube.com/watch?v=${yt}&t=${v.start | 0}s" target="_blank" rel="noopener">YouTubeで開く ↗</a></p>`;
    }
    if (/\.(mp4|webm|ogg)(\?|#|$)/i.test(v.url)) {
      return `<div class="video"><video src="${esc(v.url)}#t=${v.start | 0}${v.end ? `,${v.end | 0}` : ''}" controls preload="metadata"></video></div>
        <p class="video-alt small">${range}</p>`;
    }
    return `<div class="video placeholder"><div><div class="ph-icon">↗</div><a href="${esc(v.url)}" target="_blank" rel="noopener">外部サイトで動画を見る</a></div></div>`;
  }

  // 部門の試合に紐づく動画を動画URLごとにまとめ、最初の試合の開始〜最後の試合の終了までを埋め込む
  function divisionVideos(div) {
    const groups = new Map();
    for (const m of div.matches.filter((x) => x.video && x.video.url)) {
      const key = parseYouTube(m.video.url) || m.video.url;
      if (!groups.has(key)) groups.set(key, { url: m.video.url, start: Infinity, end: 0, open: false, count: 0 });
      const g = groups.get(key);
      g.start = Math.min(g.start, m.video.start | 0);
      if (m.video.end) g.end = Math.max(g.end, m.video.end | 0); else g.open = true;
      g.count++;
    }
    if (!groups.size) return '';
    const vs = [...groups.values()].sort((x, y) => x.start - y.start);
    return `<section><h2>大会動画 <small>${esc(S.cls(div.classId).name)} ${ARM[div.arm]}</small></h2>
      <div class="stack">${vs.map((g) => `<div>${vs.length > 1 ? `<p class="muted small">${g.count}試合</p>` : ''}${videoPlayer({ url: g.url, start: g.start, end: g.open ? 0 : g.end })}</div>`).join('')}</div></section>`;
  }

  function videoThumb(m) {
    const yt = m.video && parseYouTube(m.video.url);
    const A = S.athlete(m.a), B = S.athlete(m.b), t = S.tournament(m.tournamentId);
    return `<a class="vthumb" href="#/matches/${m.id}">
      <span class="vthumb-img"${yt ? ` style="background-image:url('https://i.ytimg.com/vi/${yt}/hqdefault.jpg')"` : ''}><span class="play">▶</span></span>
      <span class="vthumb-title">${esc(A.name)} vs ${esc(B.name)}</span>
      <span class="vthumb-sub">${esc(t.short)} / ${esc(S.cls(m.classId).name)} ${ARM[m.arm]} ${esc(m.label)}</span>
    </a>`;
  }

  function segmented(name, items, current) {
    return `<div class="seg" role="tablist" data-seg="${name}">${items
      .map(([v, l]) => `<button type="button" role="tab" data-v="${esc(v)}" class="${v === current ? 'on' : ''}" aria-selected="${v === current}">${esc(l)}</button>`)
      .join('')}</div>`;
  }
  function bindSegmented(root, name, onChange) {
    const seg = root.querySelector(`[data-seg="${name}"]`);
    if (!seg) return;
    seg.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      seg.querySelectorAll('button').forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
      onChange(b.dataset.v);
    });
  }

  // ---------- 大会結果（トーナメント表 / リーグ表） ----------
  // 試合ボックス（クリックで試合ページへ）
  function bx(m) {
    const line = (id) => {
      const a = S.athlete(id);
      const w = m.winner === id;
      return `<span class="bx-line ${w ? 'win' : ''}" title="${esc(a.name)}">${photo(a, 'xs')}<span class="grow">${esc(mainName(a))}</span>${w ? '<b>WIN</b>' : ''}</span>`;
    };
    return `<a class="bx" href="#/matches/${m.id}" title="${esc(m.label)}：試合ページへ">${line(m.a)}${line(m.b)}<span class="bx-foot">${esc(m.method)}${m.video ? '<span class="bx-v">▶ 動画</span>' : ''}</span></a>`;
  }
  const bkCol = (label, ms, last) => `<div class="bk-col${last ? ' last' : ''}"><h4>${esc(label)}</h4><div class="bk-ms">${ms.map(bx).join('')}</div></div>`;

  function roundColumns(ms, round, finalRound, finalLabel) {
    const nos = [...new Set(ms.filter((m) => m.round === round).map((m) => m.no))].sort((a, b) => a - b);
    const cols = nos.map((no) => {
      const col = ms.filter((m) => m.round === round && m.no === no).sort((x, y) => x.slot - y.slot);
      return bkCol(col[0].customLabel ? col[0].label : `${no}回戦`, col);
    });
    const f = ms.filter((m) => m.round === finalRound);
    if (f.length) cols.push(bkCol(finalLabel, f, true));
    return cols.join('');
  }

  function doubleBracket(div) {
    const ms = div.matches;
    const finals = ms.filter((m) => m.round === 'F' || m.round === 'F2').sort((x, y) => x.sortKey - y.sortKey);
    return `<div class="de">
      <div class="de-w"><h3 class="de-title"><span class="dot w"></span>本戦</h3><div class="bk">${roundColumns(ms, 'W', 'WF', '本戦決勝')}</div></div>
      <div class="de-l"><h3 class="de-title"><span class="dot l"></span>敗者復活戦</h3><div class="bk">${roundColumns(ms, 'L', 'LF', '敗者復活戦決勝')}</div></div>
      <div class="de-f">
        <h3 class="de-title"><span class="dot f"></span>決勝</h3>
        <p class="muted small">本戦決勝の勝者 vs 敗者復活戦決勝の勝者</p>
        ${finals.map((m) => `<div class="de-fm"><h4>${esc(m.roundName)}</h4>${bx(m)}</div>`).join('')}
        ${!finals.length ? '<p class="muted small">決勝の結果は未登録です</p>' : div.incomplete ? '' : finals.length === 1 ? '<p class="muted small">本戦側が勝利したため決勝2回戦目はなし</p>' : '<p class="muted small">敗者復活戦側が1回戦目を制したため2回戦目を実施</p>'}
      </div>
    </div>`;
  }

  function leagueView(div) {
    const table = S.leagueTable(div.key);
    const ids = table.map((r) => r.athleteId);
    const q = div.matches.filter((m) => m.round === 'Q');
    const cell = (x, y) => {
      if (x === y) return '<td class="lg-x"></td>';
      const m = q.find((mm) => (mm.a === x && mm.b === y) || (mm.a === y && mm.b === x));
      if (!m) return '<td></td>';
      const w = m.winner === x;
      return `<td class="lg-c ${w ? 'w' : 'l'}"><a href="#/matches/${m.id}" title="${esc(S.athlete(x).name)} vs ${esc(S.athlete(y).name)}（${esc(m.label)}）">${w ? '○' : '●'}</a></td>`;
    };
    const f = div.matches.find((m) => m.round === 'F');
    const nos = [...new Set(q.map((m) => m.no))].sort((a, b) => a - b);
    return `<div class="lg-layout">
      <div class="lg-main">
        <h3 class="de-title"><span class="dot q"></span>予選リーグ</h3>
        <div class="lg-scroll"><table class="lg">
          <thead><tr><th>順位</th><th class="lg-name">選手</th>${ids.map((id) => `<th class="lg-h">${photo(S.athlete(id), 'xs')}<span>${esc(familyName(S.athlete(id)))}</span></th>`).join('')}<th>勝</th><th>敗</th></tr></thead>
          <tbody>${table.map((r) => {
            const a = S.athlete(r.athleteId);
            return `<tr class="${f && (r.athleteId === f.a || r.athleteId === f.b) ? 'adv' : ''}"><td class="lg-rank">${r.rank}</td><th class="lg-name"><a href="#/athletes/${a.id}">${photo(a, 'xs')}<span>${esc(a.name)}</span></a></th>${ids.map((y) => cell(r.athleteId, y)).join('')}<td><strong>${r.w}</strong></td><td>${r.l}</td></tr>`;
          }).join('')}</tbody>
        </table></div>
        <p class="muted small">○ 勝ち / ● 負け。順位は 勝数 → 直接対決 → ピン勝ち数 で決定${f ? '。上位2名が決勝へ進出' : ''}。</p>
      </div>
      ${f ? `<div class="de-f"><h3 class="de-title"><span class="dot f"></span>決勝</h3><p class="muted small">予選1位 vs 予選2位</p><div class="de-fm">${bx(f)}</div></div>` : ''}
    </div>
    <details class="lg-order">
      <summary>予選の対戦順を見る</summary>
      <div class="bk">${nos.map((no) => bkCol(`${no}回戦`, q.filter((m) => m.no === no).sort((x, y) => x.slot - y.slot))).join('')}</div>
    </details>`;
  }

  // 同じ大会で出場した他の階級（なければ空配列）
  const otherClasses = (tournamentId, athleteId, classId) => {
    const e = S.multiClassEntrants(tournamentId).find((x) => x.athleteId === athleteId);
    return e ? e.classIds.filter((c) => c !== classId) : [];
  };
  const multiNote = (tournamentId, athleteId, classId) => {
    const others = otherClasses(tournamentId, athleteId, classId);
    return others.length ? `<span class="multi-note">＋${others.map((c) => esc(S.cls(c).name)).join('・')} にも出場</span>` : '';
  };

  function podium(div) {
    if (!div.standings.length) return empty('結果はまだありません');
    return `<div class="podium">${[1, 2, 3].map((place) => {
      const p = div.standings.find((x) => x.place === place);
      // 決勝が未登録などで順位が決まっていない枠
      if (!p) return `<div class="pod p${place} pod-empty"><span class="pod-rank">${place}<small>位</small></span><span class="muted">未確定</span><small class="muted">試合結果が未登録です</small></div>`;
      const a = S.athlete(p.athleteId);
      return `<a class="pod p${p.place}" href="#/athletes/${a.id}">
        <span class="pod-rank">${p.place}<small>位</small></span>
        <strong>${esc(publicName(a))}</strong>
        ${multiNote(div.tournamentId, a.id, div.classId)}
      </a>`;
    }).join('')}</div>`;
  }

  // 試合結果が未登録の部門：出場選手の一覧（国名順。順位を示さないよう並べ替える）
  function entrantList(div) {
    const list = div.entries.map((id) => S.athlete(id))
      .sort((x, y) => x.countryName.localeCompare(y.countryName, 'ja') || x.name.localeCompare(y.name, 'ja'));
    return `<h3 class="de-title"><span class="dot q"></span>出場選手 <small class="muted">${list.length}名</small></h3>
      <p class="muted small">試合結果・順位は未登録です。</p>
      <div class="entrants">${list.map((a) => `<a class="entrant" href="#/athletes/${a.id}">${photo(a, 'sm')}<span class="grow"><strong>${esc(mainName(a))}</strong><small class="muted">${esc(altName(a))}</small></span><span class="chip country">${esc(a.countryName)}</span></a>`).join('')}</div>`;
  }

  // この大会で複数階級に出場した選手の一覧
  function multiClassSection(tournamentId, arm) {
    const list = S.multiClassEntrants(tournamentId);
    if (!list.length) return '';
    return `<section>
      <h2>複数階級に出場した選手</h2>
      <div class="card"><ul class="opp">${list.map((e) => {
        const a = S.athlete(e.athleteId);
        const w = S.weightOf(tournamentId, a.id);
        return `<li><span class="grow">${esc(publicName(a))}</span>
          <span class="chips">${e.classIds.map((c) => {
            const arms = S.divisionsOf(tournamentId).filter((d) => d.classId === c && d.entries.includes(a.id)).map((d) => d.arm);
            const aa = arms.includes(arm) ? arm : arms[0];
            return `<a class="chip multi-link" href="#/tournaments/${tournamentId}?c=${c}&arm=${aa}">${esc(S.cls(c).name)} ${arms.map((x) => ARM[x]).join('・')}</a>`;
          }).join('')}</span></li>`;
      }).join('')}</ul></div>
    </section>`;
  }

  // ---------- ビュー ----------
  function viewHome() {
    const ts = S.tournaments();
    const latest = ts[0];
    const divs = S.divisionsOf(latest.id);

    const champs = divs.map((d) => {
      if (!d.standings.length) return '';
      const w = S.athlete(d.standings[0].athleteId);
      return `<a class="champ" href="#/tournaments/${latest.id}?c=${d.classId}&arm=${d.arm}">
        <span class="champ-cls">${esc(S.cls(d.classId).name)} ${armChip(d.arm)}</span>
        <span class="champ-name"><span><strong>${esc(publicName(w))}</strong><small>${esc(w.team)}</small></span></span>
        <span class="champ-foot">${esc(S.formatName(d.format))}</span>
      </a>`;
    }).join('');

    return {
      html: `
      <div class="disclaimer" role="note">
        <p>このサイトは個人運営の試作サイトであり、日本腕相撲協会・AJAF・JAWA・JAF・AAF/WAFの公式サイトではありません。</p>
        <p class="source">データ引用元：日本腕相撲協会・AJAF・JAWA・JAF・WAF（世界アームレスリング連盟）公式サイト</p>
      </div>
      <section class="hero">
        <div>
          <p class="eyebrow">ARMWRESTLING RESULTS DATABASE</p>
          <h1>アームレスリング・腕相撲の<br>結果を見る（簡易版）。</h1>
          <p class="lead">アームレスリングの大会成績を簡易で確認でき、一部動画のリンクもあります。</p>
        </div>
        <div class="kpis">
          <div class="kpi"><strong>${ts.length}</strong><span>大会</span></div>
        </div>
      </section>

      <section>
        <div class="sec-head"><h2>最新大会の優勝者 <small>${esc(latest.name)}（${fmtDate(latest.date)}）</small></h2><a href="#/tournaments/${latest.id}">大会結果 →</a></div>
        <div class="champ-grid">${champs}</div>
      </section>`,
    };
  }

  const orgChip = (t) => (t.organizer ? chip(`主催: ${t.organizer}`, 'org') : '');

  function viewTournaments(q) {
    const st = { y: q.get('y') || '', org: q.get('org') || '' };
    const years = [...new Set(S.tournaments().map((t) => t.date.slice(0, 4)))].sort().reverse();
    const card = (t) => {
      const divs = S.divisionsOf(t.id);
      const n = S.matches({ tournamentId: t.id }).length;
      const formats = [...new Set(divs.map((d) => S.formatName(d.format)))];
      return `<a class="card t-card" href="#/tournaments/${t.id}">
        <div class="t-date"><span>${t.date.slice(0, 4)}</span><strong>${t.date.slice(5).replace('-', '/')}</strong></div>
        <div class="grow">
          <div class="chips">${t.sample ? chip('サンプル', 'sample') : ''}${orgChip(t)}${chip(t.level)}${formats.map((f) => chip(f)).join('')}</div>
          <h3>${esc(t.name)}</h3>
          <p class="muted">${t.endDate ? `${fmtPeriod(t)} ・ ` : ''}${esc(t.venue)} ・ ${!divs.length ? '部門・結果未登録' : `${divs.length}部門 ・ ${n ? `${n}試合` : `出場${new Set(divs.flatMap((d) => d.entries)).size}名（結果未登録）`}`}</p>
          <ul class="t-champs">${divs.filter((d) => d.standings.length).map((d) => `<li>${esc(S.cls(d.classId).name)} ${ARM[d.arm]}: <strong>${esc(publicName(S.athlete(d.standings[0].athleteId)))}</strong></li>`).join('')}</ul>
        </div>
      </a>`;
    };
    const listHtml = () => {
      const ts = S.tournaments().filter((t) =>
        (!st.y || t.date.startsWith(st.y)) &&
        (!st.org || (t.organizer || 'その他') === st.org));
      return `<p class="muted small">${ts.length}件</p>${ts.length ? `<div class="stack">${ts.map(card).join('')}</div>` : empty('該当する大会はありません')}`;
    };
    return {
      title: '大会一覧',
      html: `
      <h1 class="page-title">大会一覧</h1>
      <div class="filters">
        <select data-k="y" aria-label="年"><option value="">すべての年</option>${years.map((y) => opt(y, `${y}年`, st.y)).join('')}</select>
        <select data-k="org" aria-label="主催"><option value="">すべての主催</option>${S.organizers().map((o) => opt(o, o, st.org)).join('')}</select>
      </div>
      <div id="tlist">${listHtml()}</div>`,
      mount(root) {
        root.querySelectorAll('[data-k]').forEach((el) => el.addEventListener('change', () => {
          st[el.dataset.k] = el.value;
          root.querySelector('#tlist').innerHTML = listHtml();
        }));
      },
    };
  }

  function viewTournament(id, q) {
    const t = S.tournament(id);
    if (!t) return viewNotFound();
    const divs = S.divisionsOf(id);
    const head = `
      <nav class="crumbs"><a href="#/tournaments">大会一覧</a> / ${esc(t.short)}</nav>
      <header class="t-head">
        <h1>${esc(t.name)}</h1>
        <p class="muted">${t.sample ? chip('サンプル', 'sample') + ' ' : ''}${t.organizer ? orgChip(t) + ' ' : ''}${fmtPeriod(t)} ・ ${esc(t.venue)} ・ ${esc(t.level)}</p>
      </header>`;
    // 部門が未登録の大会は概要のみ表示
    if (!divs.length) return { title: t.name, html: `${head}<section class="card result-card">${empty('この大会の部門・試合データはまだ登録されていません')}</section>` };
    const cids = [...new Set(divs.map((d) => d.classId))];
    const c = cids.includes(q.get('c')) ? q.get('c') : cids[0];
    const arms = divs.filter((d) => d.classId === c).map((d) => d.arm);
    const arm = arms.includes(q.get('arm')) ? q.get('arm') : arms[0];
    const div = S.division(`${id}-${c}-${arm}`);
    const tab = (cc, aa, label, on) => `<a class="${on ? 'on' : ''}" href="#/tournaments/${id}?c=${cc}&arm=${aa}">${esc(label)}</a>`;
    const armFor = (cc) => (divs.some((d) => d.classId === cc && d.arm === arm) ? arm : divs.find((d) => d.classId === cc).arm);
    // この階級（左右両方）の動画付き試合
    const classVideoMatches = () => divs
      .filter((d) => d.classId === c)
      .flatMap((d) => S.division(d.key).matches)
      .filter((m) => m.video)
      .sort((x, y) => (x.arm === y.arm ? 0 : x.arm === 'R' ? -1 : 1) || x.sortKey - y.sortKey || (x.slot || 0) - (y.slot || 0));

    return {
      title: t.name,
      html: `${head}
      <div class="tabs">${cids.map((cc) => tab(cc, armFor(cc), S.cls(cc).name, cc === c)).join('')}</div>
      <div class="tabs sub">${arms.map((aa) => tab(c, aa, ARM[aa], aa === arm)).join('')}<span class="chip fmt">${esc(S.formatName(div.format))}</span></div>

      <section>
        <h2>最終順位 <small>${esc(S.cls(c).name)} ${ARM[arm]}</small></h2>
        ${podium(div)}
      </section>

      ${divisionVideos(div)}`,
      mount(root) {
        const btn = root.querySelector('#exportVideos');
        if (!btn) return;
        btn.addEventListener('click', () => {
          const rows = [['YouTube URL', '開始時間', '終了時間', '大会名', '階級＆回戦', '対戦者A', '対戦者B']];
          for (const m of classVideoMatches()) {
            const yt = parseYouTube(m.video.url);
            rows.push([
              yt ? `https://www.youtube.com/watch?v=${yt}` : m.video.url,
              fmtSec(m.video.start || 0),
              m.video.end ? fmtSec(m.video.end) : '',
              t.name,
              `${S.cls(m.classId).name} ${ARM[m.arm]} ${m.label}`,
              mainName(S.athlete(m.a)),
              mainName(S.athlete(m.b)),
            ]);
          }
          const safe = (s) => s.replace(/[\\/:*?"<>|]/g, '_').trim();
          window.XlsxWriter.download(rows, `${safe(t.name)}_${safe(S.cls(c).name)}.xlsx`, {
            sheetName: '動画データ',
            widths: [46, 11, 11, 34, 36, 26, 26],
          });
        });
      },
    };
  }

  function athleteCard(a) {
    const s = S.athleteStats(a.id);
    return `<a class="card a-card" href="#/athletes/${a.id}">
      ${photo(a, 'lg')}
      <span class="grow">
        <strong>${esc(mainName(a))}</strong>
        <small class="muted">${a.nicknames.length ? `${quoted(a)} ` : ''}${esc(altName(a))}</small>
        <span class="chips">${a.nationality !== 'JPN' ? countryChip(a) : ''}${classChips(a)}${a.dominant ? chip(`利き腕: ${DOMINANT[a.dominant]}`, a.dominant === 'B' ? 'arm-B' : `arm-${a.dominant}`) : ''}${a.team ? chip(a.team) : ''}</span>
      </span>
      <span class="a-rec"><strong>${s.wins}-${s.losses}</strong><small>${s.titles ? `優勝 ${s.titles}回` : `勝率 ${pct(s.wins, s.total)}%`}</small></span>
    </a>`;
  }

  function viewAthletes(q) {
    const st = { kw: q.get('q') || '', c: q.get('c') || '', arm: q.get('arm') || '' };
    const listHtml = () => {
      const rows = S.searchAthletes(st.kw, { classId: st.c, arm: st.arm });
      return `<p class="muted small">${rows.length}名</p>${rows.length ? `<div class="agrid">${rows.map(athleteCard).join('')}</div>` : empty('該当する選手はいません')}`;
    };
    return {
      title: '選手一覧',
      html: `
      <h1 class="page-title">選手一覧</h1>
      <div class="filters">
        <input type="search" data-k="kw" placeholder="名前・あだ名・チームで検索" aria-label="キーワード" value="${esc(st.kw)}">
        <select data-k="c" aria-label="階級"><option value="">すべての階級</option>${S.classes().map((c) => opt(c.id, c.name, st.c)).join('')}</select>
        <select data-k="arm" aria-label="参加腕"><option value="">すべての参加腕</option>${opt('R', '右腕に出場', st.arm)}${opt('L', '左腕に出場', st.arm)}${opt('B', '両腕に出場', st.arm)}</select>
      </div>
      <div id="alist">${listHtml()}</div>`,
      mount(root) {
        root.querySelectorAll('[data-k]').forEach((el) => el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', () => {
          st[el.dataset.k] = el.value;
          root.querySelector('#alist').innerHTML = listHtml();
        }));
      },
    };
  }

  function viewAthlete(id) {
    const a = S.athlete(id);
    if (!a) return viewNotFound();
    const s = S.athleteStats(id);
    const armBar = (arm) => {
      const r = s.byArm[arm], t = r.w + r.l;
      if (!t) return `<div class="armbar"><span class="armbar-l">${ARM[arm]}</span><span class="muted small grow">出場なし</span></div>`;
      return `<div class="armbar"><span class="armbar-l">${ARM[arm]}</span>
        <span class="bar"><span style="width:${pct(r.w, t)}%"></span></span>
        <span class="armbar-r"><strong>${r.w}-${r.l}</strong> <small class="muted">${pct(r.w, t)}%</small></span></div>`;
    };
    const histHtml = (arm) => matchList(arm ? s.matches.filter((m) => m.arm === arm) : s.matches, id);
    const placeCell = (h, arm) => {
      const r = h.arms[arm];
      if (!r) return '<td class="muted">-</td>';
      const href = `#/tournaments/${h.tournament.id}?c=${h.classId}&arm=${arm}`;
      return `<td><a href="${href}">${r.place ? placeMark(r.place) : '<span class="muted small">出場</span>'}</a></td>`;
    };

    return {
      title: a.name,
      html: `
      <nav class="crumbs"><a href="#/athletes">選手一覧</a> / ${esc(mainName(a))}</nav>
      <header class="profile card">
        ${photo(a, 'profile', a.name)}
        <div class="grow">
          <h1>${esc(mainName(a))} <small class="muted">${esc(altName(a))}</small></h1>
          ${a.nicknames.length ? `<p class="nick-lg">${quoted(a)}</p>` : ''}
          <div class="chips">
            ${countryChip(a)}
            ${classChips(a)}
            ${a.dominant ? chip(`利き腕: ${DOMINANT[a.dominant]}`, a.dominant === 'B' ? 'arm-B' : `arm-${a.dominant}`) : ''}
            ${a.latestWeight != null ? chip(`直近の計量: ${kg(a.latestWeight)}`) : ''}
            ${a.team ? chip(a.team) : ''}
          </div>
          <p>${esc(a.bio).replace(/\n/g, '<br>')}</p>          ${a.classIds.length > 1 ? `<p class="small">出場したことのある階級: <strong>${a.classIds.map((c) => esc(S.cls(c).name)).join(' / ')}</strong></p>` : ''}
          <p class="muted small">※ 利き腕は大会の出場記録（右腕のみ / 左腕のみ / 両腕）から判定しています。</p>
        </div>
      </header>

      <div class="stats">
        <div class="stat"><span>通算成績</span><strong>${s.wins}勝 ${s.losses}敗</strong></div>
        <div class="stat"><span>勝率</span><strong>${pct(s.wins, s.total)}%</strong></div>
        <div class="stat"><span>優勝 / 入賞(3位以内)</span><strong>${s.titles} / ${s.medals}</strong></div>
        <div class="stat"><span>ピン勝ち率</span><strong>${pct(s.pins, s.wins)}%</strong></div>      </div>

      ${s.detail.recorded ? `<div class="stats stats-6">
        <div class="stat"><span>詳細記載</span><strong>${s.detail.recorded}/${s.detail.total}</strong></div>
        <div class="stat"><span>ファール数</span><strong>${s.detail.fouls}/${s.detail.recorded}</strong></div>
        <div class="stat"><span>ワーニング数</span><strong>${s.detail.warnings}/${s.detail.recorded}</strong></div>
        <div class="stat"><span>ストラップ申請回数</span><strong>${s.detail.strapRequests}/${s.detail.recorded}</strong></div>
        <div class="stat"><span>ストラップ回数</span><strong>${s.detail.straps}/${s.detail.recorded}</strong></div>
        <div class="stat"><span>レフリーズグリップ回数</span><strong>${s.detail.refereeGrips}/${s.detail.recorded}</strong></div>
      </div>` : ''}

      <section class="card">
        <h2>大会成績</h2>
        <div class="tbl-scroll"><table class="tbl">
          <thead><tr><th>日付</th><th>大会</th><th>階級</th><th>右腕</th><th>左腕</th></tr></thead>
          <tbody>${s.history.map((h, i) => {
            // 同じ大会で複数階級に出場した場合は、日付・大会をまとめて表示
            const first = i === 0 || s.history[i - 1].tournament.id !== h.tournament.id;
            const rs = h.classCount > 1 ? ` rowspan="${h.classCount}"` : '';
            return `<tr class="${h.classCount > 1 ? 'multi-row' : ''}">
            ${first ? `<td${rs}>${fmtDate(h.tournament.date)}</td>
            <td${rs}><a href="#/tournaments/${h.tournament.id}?c=${h.classId}">${esc(h.tournament.short)}</a>${h.classCount > 1 ? `<br>${chip(`${h.classCount}階級に出場`, 'multi')}` : ''}</td>` : ''}
            <td>${esc(S.cls(h.classId).name)}</td>
            ${placeCell(h, 'R')}${placeCell(h, 'L')}
          </tr>`;
          }).join('')}</tbody>
        </table></div>
        <p class="muted small">順位は上位3名のみ表示しています。同じ大会で複数の階級に出場した場合は、階級ごとに1行ずつ表示します。</p>
      </section>

      <div class="grid2">
        <section class="card">
          <h2>腕別成績</h2>${armBar('R')}${armBar('L')}
        </section>
        <section class="card">
          <h2>対戦相手別</h2>
          <ul class="opp">${s.opponents.map((o) => {
            const b = S.athlete(o.athleteId);
            return `<li>${photo(b, 'sm')}<a class="grow name-link" href="#/athletes/${b.id}">${nameLines(b)}</a><span class="${o.w >= o.l ? 'pos' : 'neg'}">${o.w}-${o.l}</span><a class="btn xs" href="#/h2h?a=${id}&b=${b.id}">比較</a></li>`;
          }).join('')}</ul>
        </section>
      </div>

      <section>
        <div class="sec-head"><h2>試合履歴</h2>${segmented('hist', [['', 'すべて'], ['R', '右腕'], ['L', '左腕']], '')}</div>
        <div id="hist">${histHtml('')}</div>
      </section>`,
      mount(root) {
        bindSegmented(root, 'hist', (arm) => { root.querySelector('#hist').innerHTML = histHtml(arm); });
      },
    };
  }

  function viewMatches(q) {
    const PAGE = 40;
    const st = { t: q.get('t') || '', c: q.get('c') || '', arm: q.get('arm') || '', round: q.get('round') || '', video: q.get('video') === '1', shown: PAGE };
    const listHtml = () => {
      const ms = S.matches({ tournamentId: st.t, classId: st.c, arm: st.arm, round: st.round, withVideo: st.video });
      return `<p class="muted small">${ms.length}件</p>${matchList(ms.slice(0, st.shown))}
        ${ms.length > st.shown ? `<div class="more"><button type="button" class="btn" id="more">さらに表示（残り${ms.length - st.shown}件）</button></div>` : ''}`;
    };
    return {
      title: '試合一覧',
      html: `
      <h1 class="page-title">試合一覧</h1>
      <div class="filters">
        <select data-k="t" aria-label="大会"><option value="">すべての大会</option>${S.tournaments().map((t) => opt(t.id, t.name, st.t)).join('')}</select>
        <select data-k="c" aria-label="階級"><option value="">すべての階級</option>${S.classes().map((c) => opt(c.id, c.name, st.c)).join('')}</select>
        <select data-k="arm" aria-label="腕"><option value="">右腕・左腕</option>${opt('R', '右腕', st.arm)}${opt('L', '左腕', st.arm)}</select>
        <select data-k="round" aria-label="試合区分"><option value="">すべての試合区分</option>${S.rounds().map((r) => opt(r.id, r.name, st.round)).join('')}</select>
        <label class="check"><input type="checkbox" data-k="video"${st.video ? ' checked' : ''}> 動画ありのみ</label>
      </div>
      <div id="mlist">${listHtml()}</div>`,
      mount(root) {
        const out = root.querySelector('#mlist');
        const render = () => { out.innerHTML = listHtml(); };
        root.querySelectorAll('[data-k]').forEach((el) => el.addEventListener('change', () => {
          st[el.dataset.k] = el.type === 'checkbox' ? el.checked : el.value;
          st.shown = PAGE;
          render();
        }));
        out.addEventListener('click', (e) => {
          if (e.target.id === 'more') { st.shown += PAGE; render(); }
        });
      },
    };
  }

  function viewMatch(id) {
    const m = S.match(id);
    if (!m) return viewNotFound();
    const t = S.tournament(m.tournamentId);
    const A = S.athlete(m.a), B = S.athlete(m.b);
    const h = S.headToHead(m.a, m.b);
    const others = h.matches.filter((x) => x.id !== m.id);
    const sameDiv = S.matches({ divKey: m.divKey }).filter((x) => x.id !== m.id);
    const divHref = `#/tournaments/${t.id}?c=${m.classId}&arm=${m.arm}`;
    const dt = m.detail || {};
    const detailVal = (v) => (v == null || v === '' ? '<span class="muted">未記入</span>' : esc(String(v)));
    // 左選手 - 右選手 の形式（対戦成績と同じ並び）。[a, b] または { 選手ID: 数 } で指定
    const pairVal = (p) => { const v = S.detailPair(m, p); return v.length ? `${detailVal(v[0])} - ${detailVal(v[1])}` : detailVal(null); };
    // 詳細が1つも入っていない試合は「詳細：未記入」の1行にまとめる
    const hasDetail = S.hasDetail(m);

    const fighter = (x) => {
      const s = S.athleteStats(x.id);
      return `<a class="fighter ${m.winner === x.id ? 'win' : 'lose'}" href="#/athletes/${x.id}">
        ${photo(x, 'xl', x.name)}
        <strong>${esc(mainName(x))}</strong>${subName(x) ? `<span class="name-sub">${esc(subName(x))}</span>` : ''}${nick(x)}<small>${esc(x.team)}</small>
        <span class="muted small">${x.countryName ? `${esc(x.countryName)} ・ ` : ''}${S.weightOf(t.id, x.id) != null ? `計量 ${kg(S.weightOf(t.id, x.id))} ・ ` : ''}通算 ${s.wins}-${s.losses}</span>
        ${multiNote(t.id, x.id, m.classId)}
        <span class="result">${m.winner === x.id ? 'WIN' : 'LOSE'}</span>
      </a>`;
    };

    return {
      title: `${A.name} vs ${B.name}`,
      html: `
      <nav class="crumbs"><a href="${divHref}">${esc(t.short)} ${esc(S.cls(m.classId).name)} ${ARM[m.arm]}</a> / ${esc(m.label)}</nav>
      <div class="match-layout">
        <div>
          <div id="player">${videoPlayer(m.video)}</div>
          <details class="card vform" ${m.video ? '' : 'open'}>
            <summary>${m.video ? '動画を変更する' : '動画を登録する'}</summary>
            <form id="vf">
              <label>動画URL（YouTube / mp4 など）<input type="url" name="url" required placeholder="https://www.youtube.com/watch?v=..." value="${esc(m.video ? m.video.url : '')}"></label>
              <div class="row2">
                <label>開始位置（時:分:秒 / 分:秒 / 秒）<input type="text" name="start" placeholder="例: 1:32:08" value="${m.video && m.video.start ? fmtSec(m.video.start) : ''}"></label>
                <label>終了位置（空欄なら最後まで）<input type="text" name="end" placeholder="例: 1:33:43" value="${m.video && m.video.end ? fmtSec(m.video.end) : ''}"></label>
              </div>
              <div class="row">
                <button class="btn primary" type="submit">保存</button>
                ${m.video && m.video.local ? '<button class="btn" type="button" id="vdel">登録を削除</button>' : ''}
                <span class="muted small" id="vmsg"></span>
              </div>
              <p class="muted small">※ プロトタイプでは、このブラウザにのみ保存されます。</p>
            </form>
          </details>
        </div>
        <aside>
          <div class="card match-card">
            <div class="chips center">${chip(S.cls(m.classId).name)}${armChip(m.arm)}${roundChip(m)}</div>
            <div class="vs-wrap">${fighter(A)}<span class="vs big">VS</span>${fighter(B)}</div>
            <dl class="facts">
              <div><dt>試合区分</dt><dd>${esc(m.label)}</dd></div>
              <div><dt>決着</dt><dd>${esc(m.method)}</dd></div>
              ${hasDetail ? `<div><dt>ファール数</dt><dd>${pairVal(dt.fouls)}</dd></div>
              <div><dt>ワーニング数</dt><dd>${pairVal(dt.warnings)}</dd></div>
              <div><dt>ストラップ申請</dt><dd>${detailVal(dt.strapRequest)}</dd></div>
              <div><dt>ストラップ</dt><dd>${detailVal(dt.strap)}</dd></div>
              <div><dt>レフリーズグリップ</dt><dd>${detailVal(dt.refereeGrip)}</dd></div>` : `<div><dt>詳細</dt><dd>${detailVal(null)}</dd></div>`}
              <div><dt>備考</dt><dd>${[dt.remark, m.note].some((v) => v) ? [dt.remark, m.note].filter((v) => v).map((v) => esc(v)).join('<br>') : detailVal(null)}</dd></div>
              <div><dt>大会形式</dt><dd>${esc(S.formatName(m.format))}</dd></div>
              <div><dt>大会</dt><dd><a href="${divHref}">${esc(t.name)}</a></dd></div>
              <div><dt>日付・会場</dt><dd>${fmtPeriod(t)} ${esc(t.venue)}</dd></div>
            </dl>
            <a class="btn block" href="${divHref}">${m.format === 'league' ? 'リーグ表' : 'トーナメント表'}で見る</a>
          </div>
          <div class="card">
            <h3>この2人の対戦成績</h3>
            <div class="h2h-mini"><span>${nameLines(A)}</span><strong>${h.aWins} - ${h.bWins}</strong><span>${nameLines(B)}</span></div>
            <a class="btn block" href="#/h2h?a=${A.id}&b=${B.id}">詳しく比較する</a>
          </div>
        </aside>
      </div>
      ${others.length ? `<section><h2>この2人の他の対戦</h2>${matchList(others)}</section>` : ''}
      <section><h2>同じ部門の試合</h2>${matchList(sameDiv)}</section>`,
      mount(root) {
        const f = root.querySelector('#vf');
        f.addEventListener('submit', (e) => {
          e.preventDefault();
          const url = f.url.value.trim();
          if (!/^https?:\/\//i.test(url)) { root.querySelector('#vmsg').textContent = 'http(s) のURLを入力してください'; return; }
          const start = f.start.value.trim() ? parseStart(f.start.value) : startFromUrl(url);
          const end = f.end.value.trim() ? parseStart(f.end.value) : 0;
          if (end && end <= start) { root.querySelector('#vmsg').textContent = '終了位置は開始位置より後にしてください'; return; }
          if (!S.setVideo(id, url, start, end)) { root.querySelector('#vmsg').textContent = '保存に失敗しました'; return; }
          router();
        });
        const del = root.querySelector('#vdel');
        if (del) del.addEventListener('click', () => { S.removeVideo(id); router(); });
      },
    };
  }

  function viewH2H(q) {
    // 初期表示は未選択。選手Bは「選手Aと対戦したことのある選手」から選ぶ
    const opponentsOf = (id) => (id ? S.athleteStats(id).opponents : []);
    const st = { a: q.get('a') || '', b: q.get('b') || '', arm: q.get('arm') || '' };
    if (!S.athlete(st.a)) st.a = '';
    if (!opponentsOf(st.a).some((o) => o.athleteId === st.b)) st.b = '';
    const LIMIT = 20;
    const subInfo = (a) => [a.team, a.countryName].filter(Boolean).map(esc).join(' ・ ');

    const pickedHtml = (id, placeholder) => {
      const a = S.athlete(id);
      if (!a) return `<div class="picked none">${placeholder}</div>`;
      return `<div class="picked">${photo(a, 'lg', a.name)}<span class="grow">${nameLines(a)}${nick(a)}<small class="muted">${subInfo(a)}</small></span></div>`;
    };
    const pickedA = () => pickedHtml(st.a, '選手Aを検索して選択してください');
    const pickedB = () => pickedHtml(st.b, st.a ? '下のリストから対戦相手を選択してください' : '先に選手Aを選択してください');
    const resultsHtml = (kw) => {
      if (!kw.trim()) return '<p class="muted small">名前・あだ名・チーム名を入力して「検索」を押してください。</p>';
      const hits = S.searchAthletes(kw);
      if (!hits.length) return '<p class="muted small">該当する選手が見つかりません。</p>';
      return `<ul class="presults">${hits.slice(0, LIMIT).map((a) => `<li><button type="button" class="pick" data-id="${a.id}">${photo(a, 'sm')}<span class="grow">${nameLines(a)}${nick(a)}<small class="muted">${subInfo(a)}</small></span><span class="chip">選択</span></button></li>`).join('')}</ul>
        ${hits.length > LIMIT ? `<p class="muted small">他 ${hits.length - LIMIT} 件。条件を絞って検索してください。</p>` : ''}`;
    };
    // 選手B: 写真付きのドロップダウン（標準の select には画像を入れられないため独自実装）
    const ddButton = () => {
      const b = S.athlete(st.b);
      const inner = b
        ? `${photo(b, 'sm')}<span class="grow">${nameLines(b)}</span>`
        : `<span class="grow muted">${st.a ? '対戦相手を選択' : '選手Aを先に選択'}</span>`;
      return `<button type="button" class="dd-btn" aria-haspopup="listbox" aria-expanded="false"${st.a ? '' : ' disabled'}>${inner}<span class="dd-caret" aria-hidden="true">▾</span></button>`;
    };
    const ddItems = () => opponentsOf(st.a).map((o) => {
      const b = S.athlete(o.athleteId);
      const on = b.id === st.b;
      return `<li><button type="button" role="option" class="dd-opt${on ? ' on' : ''}" data-id="${b.id}" aria-selected="${on}">${photo(b, 'sm')}<span class="grow">${nameLines(b)}</span><span class="chip">${o.w + o.l}試合</span></button></li>`;
    }).join('');
    const ddHtml = () => `${ddButton()}<ul class="dd-list" role="listbox" aria-label="選手Bを選択" hidden>${ddItems()}</ul>`;

    const result = () => {
      if (!st.a) return empty('選手Aを検索して選択してください');
      if (!st.b) return empty('選手Bをリストから選択すると、2人の対戦成績を表示します');
      const A = S.athlete(st.a), B = S.athlete(st.b);
      const h = S.headToHead(st.a, st.b, st.arm);
      const total = h.aWins + h.bWins;
      const armLabel = st.arm ? ARM[st.arm] : '両腕';
      // 比較表は2人の対戦（両腕すべて）から集計
      const all = S.headToHead(st.a, st.b).matches;
      const wins = (id, arm) => all.filter((m) => m.winner === id && (!arm || m.arm === arm)).length;
      const aw = wins(st.a), bw = wins(st.b);
      const cmp = (label, va, vb, hi = true) => `<tr><td class="${hi && va > vb ? 'pos' : ''}">${va}</td><th>${label}</th><td class="${hi && vb > va ? 'pos' : ''}">${vb}</td></tr>`;
      // 試合詳細の集計（2人の対戦のうち詳細記載のある試合）
      const da = S.detailStats(st.a, all), db = S.detailStats(st.b, all);
      return `
        <div class="card h2h-head">
          <a href="#/athletes/${A.id}" class="h2h-side">${photo(A, 'xl', A.name)}${nameLines(A)}${nick(A)}<small class="muted">${subInfo(A)}</small></a>
          <div class="h2h-score"><small class="muted">直接対決（${armLabel}）</small><strong>${h.aWins}<span>-</span>${h.bWins}</strong><small class="muted">${total}試合</small>
            ${total ? `<span class="bar dual"><span style="width:${pct(h.aWins, total)}%"></span></span>` : ''}</div>
          <a href="#/athletes/${B.id}" class="h2h-side">${photo(B, 'xl', B.name)}${nameLines(B)}${nick(B)}<small class="muted">${subInfo(B)}</small></a>
        </div>
        <div class="card"><h3 class="center">2人の対戦成績の比較</h3><table class="cmp"><tbody>
          ${cmp('試合数', all.length, all.length, false)}
          ${cmp('左腕の勝利数', wins(st.a, 'L'), wins(st.b, 'L'))}
          ${cmp('右腕の勝利数', wins(st.a, 'R'), wins(st.b, 'R'))}
          ${cmp('勝率（全体・%）', pct(aw, all.length), pct(bw, all.length))}
          ${da.recorded ? `${cmp('試合詳細記載数', da.recorded, db.recorded, false)}
          ${cmp('ファール総数', da.fouls, db.fouls, false)}
          ${cmp('ワーニング総数', da.warnings, db.warnings, false)}
          ${cmp('ストラップ申請総数', da.strapRequests, db.strapRequests, false)}
          ${cmp('ストラップ総数', da.straps, db.straps, false)}
          ${cmp('レフリーズグリップ総数', da.refereeGrips, db.refereeGrips, false)}` : ''}
        </tbody></table></div>
        <section><h2>直接対決の試合</h2>${total ? matchList(h.matches, st.a) : empty(`この2人の${armLabel}での対戦記録はありません`)}</section>`;
    };

    const syncUrl = () => {
      const p = new URLSearchParams();
      if (st.a) p.set('a', st.a);
      if (st.b) p.set('b', st.b);
      if (st.arm) p.set('arm', st.arm);
      history.replaceState(null, '', `#/h2h${p.toString() ? `?${p}` : ''}`);
    };

    return {
      title: '対戦比較',
      html: `
      <h1 class="page-title">対戦比較（Head to Head）</h1>
      <div class="pickers">
        <div class="card picker">
          <div class="picker-label">選手A</div>
          <div id="pickA">${pickedA()}</div>
          <form class="psearch" id="searchA"><input type="search" name="kw" placeholder="名前・あだ名・チームで検索" aria-label="選手Aを検索"><button class="btn primary" type="submit">検索</button></form>
          <div id="resultsA"></div>
        </div>
        <span class="vs big">VS</span>
        <div class="card picker">
          <div class="picker-label">選手B（選手Aの対戦相手）</div>
          <div id="pickB">${pickedB()}</div>
          <div class="dd" id="ddB">${ddHtml()}</div>
        </div>
      </div>
      <div class="sec-head"><span class="muted small">対象の腕（直接対決のスコアと試合一覧）</span>${segmented('h2harm', [['', '両腕'], ['R', '右腕'], ['L', '左腕']], st.arm)}</div>
      <div id="h2hout">${result()}</div>`,
      mount(root) {
        const out = root.querySelector('#h2hout');
        const res = root.querySelector('#resultsA');
        const dd = root.querySelector('#ddB');
        const refreshB = () => {
          dd.innerHTML = ddHtml();
          root.querySelector('#pickB').innerHTML = pickedB();
        };
        const setOpen = (open) => {
          const btn = dd.querySelector('.dd-btn'), list = dd.querySelector('.dd-list');
          if (!btn || btn.disabled) return;
          list.hidden = !open;
          btn.setAttribute('aria-expanded', open);
          if (open) (list.querySelector('.dd-opt.on') || list.querySelector('.dd-opt'))?.focus();
        };
        root.querySelector('#searchA').addEventListener('submit', (e) => {
          e.preventDefault();
          res.innerHTML = resultsHtml(e.target.kw.value);
        });
        res.addEventListener('click', (e) => {
          const b = e.target.closest('.pick');
          if (!b) return;
          st.a = b.dataset.id;
          st.b = '';
          root.querySelector('#pickA').innerHTML = pickedA();
          res.innerHTML = '';
          root.querySelector('#searchA').reset();
          refreshB();
          syncUrl();
          out.innerHTML = result();
        });
        dd.addEventListener('click', (e) => {
          if (e.target.closest('.dd-btn')) { setOpen(dd.querySelector('.dd-list').hidden); return; }
          const o = e.target.closest('.dd-opt');
          if (!o) return;
          st.b = o.dataset.id;
          refreshB();
          syncUrl();
          out.innerHTML = result();
          dd.querySelector('.dd-btn').focus();
        });
        dd.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') { setOpen(false); dd.querySelector('.dd-btn').focus(); }
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            const opts = [...dd.querySelectorAll('.dd-opt')];
            if (!opts.length) return;
            e.preventDefault();
            if (dd.querySelector('.dd-list').hidden) { setOpen(true); return; }
            const i = opts.indexOf(document.activeElement);
            const n = e.key === 'ArrowDown' ? Math.min(i + 1, opts.length - 1) : Math.max(i - 1, 0);
            opts[n].focus();
          }
        });
        // 一覧の外をクリックしたら閉じる
        root.addEventListener('click', (e) => { if (!dd.contains(e.target)) setOpen(false); });
        bindSegmented(root, 'h2harm', (arm) => { st.arm = arm; syncUrl(); out.innerHTML = result(); });
      },
    };
  }

  function viewNotFound() {
    return { title: 'ページが見つかりません', html: `<div class="empty big"><h1>404</h1><p>ページが見つかりません。</p><a class="btn" href="#/">トップへ戻る</a></div>` };
  }

  // ---------- ルーター ----------
  // 全員閲覧用のため非公開にしているページ（選手・試合・対戦比較）
  const HIDDEN = ['athletes', 'matches', 'h2h'];
  const isHidden = (href) => HIDDEN.includes((href.slice(1).split('?')[0].split('/')[1]) || '');
  // 非公開ページへのリンクは見た目を残したままクリックできないようにする
  function unlinkHidden(root) {
    root.querySelectorAll('a[href^="#/"]').forEach((a) => {
      if (!isHidden(a.getAttribute('href'))) return;
      a.removeAttribute('href');
      a.removeAttribute('title');
      a.classList.add('nolink');
    });
  }

  const routes = [
    [/^\/?$/, () => viewHome()],
    [/^\/tournaments$/, (q) => viewTournaments(q)],
    [/^\/tournaments\/([\w-]+)$/, (id, q) => viewTournament(id, q)],
    [/^\/athletes$/, (q) => viewAthletes(q)],
    [/^\/athletes\/([\w-]+)$/, (id) => viewAthlete(id)],
    [/^\/matches$/, (q) => viewMatches(q)],
    [/^\/matches\/([\w-]+)$/, (id) => viewMatch(id)],
    [/^\/h2h$/, (q) => viewH2H(q)],
  ];

  let lastPath = null;
  function router() {
    const [path, qs] = (location.hash.slice(1) || '/').split('?');
    if (isHidden(`#${path}`)) { location.replace('#/'); return; }
    const q = new URLSearchParams(qs || '');
    let view = null;
    for (const [re, fn] of routes) {
      const m = path.match(re);
      if (m) { view = fn(...m.slice(1), q); break; }
    }
    view = view || viewNotFound();
    app.innerHTML = view.html;
    if (view.mount) view.mount(app);
    unlinkHidden(app);
    document.title = (view.title ? `${view.title} | ` : '') + '加藤 ARM';
    const section = path.split('/')[1] || 'home';
    document.querySelectorAll('[data-nav]').forEach((a) => a.classList.toggle('on', a.dataset.nav === section));
    if (path !== lastPath) window.scrollTo(0, 0);
    lastPath = path;
  }

  document.getElementById('export')?.addEventListener('click', () => {
    const json = JSON.stringify(S.exportVideos(), null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'videos.json';
    link.click();
    URL.revokeObjectURL(link.href);
  });

  window.addEventListener('hashchange', router);
  router();
})();
