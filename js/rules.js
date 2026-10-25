// 競技ルールに関わる共通処理（サンプル生成 sample-gen.js と Store の両方で使う）
window.AW_RULES = (() => {
  'use strict';

  // トーナメントのシード配置（1始まり）。例: 8枠 → [1, 8, 4, 5, 2, 7, 3, 6]
  function seedOrder(size) {
    let arr = [1];
    while (arr.length < size) {
      const n = arr.length * 2 + 1;
      arr = arr.flatMap((s) => [s, n - s]);
    }
    return arr;
  }

  // リーグ戦（予選）の順位表
  // 並び順: 勝数 → 直接対決 → ピン勝ち数 → シード順
  function leagueTable(entries, matches) {
    const rows = new Map(entries.map((id, i) => [id, { athleteId: id, seed: i, w: 0, l: 0, pins: 0 }]));
    const beat = new Set();
    for (const m of matches) {
      if (m.round !== 'Q') continue;
      const loser = m.winner === m.a ? m.b : m.a;
      const W = rows.get(m.winner), L = rows.get(loser);
      if (!W || !L) continue;
      W.w++;
      L.l++;
      if (m.method === 'ピン勝ち') W.pins++;
      beat.add(`${m.winner}>${loser}`);
    }
    const h2h = (x, y) => (beat.has(`${x}>${y}`) ? -1 : beat.has(`${y}>${x}`) ? 1 : 0);
    return [...rows.values()]
      .sort((x, y) => y.w - x.w || h2h(x.athleteId, y.athleteId) || y.pins - x.pins || x.seed - y.seed)
      .map((r, i) => ({ ...r, rank: i + 1 }));
  }

  return { seedOrder, leagueTable };
})();
