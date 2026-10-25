// サンプル用: 試合結果を自動生成する。
// data.js の division に matches が書かれていない部門だけが対象です（実データを入れたらこのファイルは不要）。
(() => {
  'use strict';
  const D = window.AW_DATA, R = window.AW_RULES;

  // 選手の強さ [右腕, 左腕]（サンプルの勝敗を決めるためだけの値）
  const POWER = {
    a01: [92, 86], a02: [90, 80], a03: [86, 60], a04: [60, 85], a05: [82, 80], a06: [80, 82], a07: [84, 60], a08: [60, 88], a09: [76, 75], a10: [83, 78],
    a11: [95, 88], a12: [88, 60], a13: [86, 90], a14: [84, 60], a15: [85, 84], a16: [80, 60], a17: [83, 86], a18: [79, 60], a19: [78, 92], a20: [80, 85], a21: [60, 82], a22: [60, 80],
    a23: [90, 86], a24: [88, 60], a25: [82, 90], a26: [80, 60], a27: [84, 60], a28: [60, 85], a29: [76, 82], a30: [60, 80],
    a31: [87, 60], a32: [60, 86],
  };
  const power = (id, arm) => (POWER[id] || [70, 70])[arm === 'R' ? 0 : 1];

  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  function makePlayer(t, d) {
    const pre = `${t.id}-${d.classId}-${d.arm}`;
    const matches = [];
    // x と y が対戦し [勝者, 敗者] を返す。どちらかが不在（不戦）の場合は試合を作らない
    function play(round, no, slot, x, y) {
      if (!x || !y) return [x || y || null, null];
      const code = ['W', 'L', 'Q'].includes(round) ? `${round}${no}-${slot}` : round;
      const id = `${pre}-${code}`;
      const sx = power(x, d.arm) + (hash(id + x) % 21);
      const sy = power(y, d.arm) + (hash(id + y) % 21);
      const winner = sx >= sy ? x : y;
      const r = hash(id + 'm') % 100;
      const method = r < 82 ? 'ピン勝ち' : r < 96 ? 'ファウル勝ち' : '棄権';
      const [a, b] = hash(id) % 2 ? [x, y] : [y, x];
      matches.push({ id, round, no, slot, a, b, winner, method });
      return winner === x ? [x, y] : [y, x];
    }
    return { matches, play };
  }

  // トーナメント（本戦 → 敗者復活戦 → 決勝）
  function genDouble(t, d) {
    const { matches, play } = makePlayer(t, d);
    let size = 4;
    while (size < d.entries.length) size *= 2;
    const rounds = Math.log2(size);

    // 本戦
    let alive = R.seedOrder(size).map((s) => d.entries[s - 1] || null);
    const wLosers = [];
    for (let r = 1; r <= rounds; r++) {
      const next = [], losers = [];
      for (let i = 0; i < alive.length; i += 2) {
        const [w, l] = play(r === rounds ? 'WF' : 'W', r, i / 2 + 1, alive[i], alive[i + 1]);
        next.push(w);
        losers.push(l);
      }
      alive = next;
      wLosers.push(losers);
    }
    const wChamp = alive[0];

    // 敗者復活戦: 1回戦は本戦1回戦の敗者同士、以降は本戦の敗者が合流
    let lno = 1;
    let surv = [];
    for (let i = 0; i < wLosers[0].length; i += 2) surv.push(play('L', lno, i / 2 + 1, wLosers[0][i], wLosers[0][i + 1])[0]);
    for (let r = 2; r < rounds; r++) {
      const drop = wLosers[r - 1];
      lno++;
      surv = surv.map((s, i) => play('L', lno, i + 1, s, drop[drop.length - 1 - i])[0]);
      if (surv.length > 1) {
        lno++;
        const next = [];
        for (let i = 0; i < surv.length; i += 2) next.push(play('L', lno, i / 2 + 1, surv[i], surv[i + 1])[0]);
        surv = next;
      }
    }
    const [lChamp] = play('LF', 0, 1, surv[0], wLosers[rounds - 1][0]);

    // 決勝: 敗者復活戦の勝者が勝った場合は決勝2回戦目
    const [fw] = play('F', 0, 1, wChamp, lChamp);
    if (wChamp && lChamp && fw === lChamp) play('F2', 0, 1, wChamp, lChamp);
    return matches;
  }

  // リーグ戦（総当たりの予選 → 上位2名で決勝）。対戦順はサークル方式
  function genLeague(t, d) {
    const { matches, play } = makePlayer(t, d);
    let rot = d.entries.slice();
    if (rot.length % 2) rot.push(null);
    const n = rot.length;
    for (let r = 0; r < n - 1; r++) {
      let slot = 1;
      for (let i = 0; i < n / 2; i++) {
        const x = rot[i], y = rot[n - 1 - i];
        if (x && y) play('Q', r + 1, slot++, x, y);
      }
      rot = [rot[0], rot[n - 1], ...rot.slice(1, n - 1)];
    }
    if (d.final) {
      const table = R.leagueTable(d.entries, matches);
      if (table.length >= 2) play('F', 0, 1, table[0].athleteId, table[1].athleteId);
    }
    return matches;
  }

  for (const t of D.tournaments) {
    for (const d of t.divisions) {
      if (!d.matches) d.matches = d.format === 'league' ? genLeague(t, d) : genDouble(t, d);
    }
  }
})();
