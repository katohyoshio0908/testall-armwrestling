// サンプルデータ（架空の選手・大会です）
// 将来的にはAPI / DBから取得する想定。Store(js/store.js) がこの形式を読み込みます。
//
// ■ 大会 tournaments[]
//   weighIns  : 大会ごとの計量体重 { 選手ID: kg }
//   divisions : 部門（階級 × 腕）ごとの試合形式と出場者
//     format  : 'double' = トーナメント（本戦 → 敗者復活戦 → 決勝）
//               'league' = リーグ戦（予選リーグ → 上位2名で決勝）
//     entries : 出場選手（シード順）
//     matches : 試合結果。省略時は js/sample-gen.js がサンプル結果を自動生成します。
//               実データは次の形式で書いてください:
//               { id: 't1-M70-R-W1-1', round: 'W', no: 1, slot: 1, a: 'a01', b: 'a10', winner: 'a01', method: 'ピン勝ち' }
//               round は下の rounds の id、no は回戦（本戦・敗者復活戦・予選のみ）、slot はその回戦内の番号。
//               試合詳細は detail に書きます（省略した項目は「未記入」と表示。fouls / warnings は [左選手(a), 右選手(b)]）:
//               detail: { fouls: [1, 0], warnings: [0, 2], strapRequest: '左選手', strap: 'あり', refereeGrip: 'あり', remark: '...' }
//
// ■ 動画 videos
//   { 試合ID: { url: 'https://www.youtube.com/watch?v=XXXXXXXXXXX', start: 秒 } }
//   画面の「動画を登録」から追加した動画はブラウザ(localStorage)に保存され、
//   「登録動画をエクスポート」で出力したJSONをここに貼り付けると全員に反映できます。
window.AW_DATA = {
  classes: [
    { id: 'M70', name: '男子 -70kg', limit: 70 },
    { id: 'M80', name: '男子 -80kg', limit: 80 },
    { id: 'W60', name: '女子 -60kg', limit: 60 },
    { id: 'SM80', name: 'シニア -80kg', limit: 80 },
    { id: 'MM70', name: 'マスターズ男子 -70kg', limit: 70 },
    { id: 'MM80', name: 'マスターズ男子 -80kg', limit: 80 },
    { id: 'MM90', name: 'マスターズ男子 -90kg', limit: 90 },
    { id: 'OPEN', name: '無差別級', limit: null },
  ],

  // 試合区分
  rounds: [
    { id: 'Q', name: '予選' },
    { id: 'W', name: '本戦' },
    { id: 'WF', name: '本戦決勝' },
    { id: 'L', name: '敗者復活戦' },
    { id: 'LF', name: '敗者復活戦決勝' },
    { id: 'F', name: '決勝' },
    { id: 'F2', name: '決勝2回戦目' },
  ],

  // 国籍（選手の nationality に id を指定）
  countries: [
    { id: 'JPN', name: '日本' },
    { id: 'NEU', name: 'WAF中立選手' },
    { id: 'AUS', name: 'オーストラリア' },
    { id: 'BGR', name: 'ブルガリア' },
    { id: 'BRA', name: 'ブラジル' },
    { id: 'CAN', name: 'カナダ' },
    { id: 'CHE', name: 'スイス' },
    { id: 'CZE', name: 'チェコ' },
    { id: 'DEU', name: 'ドイツ' },
    { id: 'ESP', name: 'スペイン' },
    { id: 'FRA', name: 'フランス' },
    { id: 'GEO', name: 'ジョージア' },
    { id: 'HUN', name: 'ハンガリー' },
    { id: 'IND', name: 'インド' },
    { id: 'ITA', name: 'イタリア' },
    { id: 'KAZ', name: 'カザフスタン' },
    { id: 'LVA', name: 'ラトビア' },
    { id: 'MDA', name: 'モルドバ' },
    { id: 'MEX', name: 'メキシコ' },
    { id: 'MNG', name: 'モンゴル' },
    { id: 'NOR', name: 'ノルウェー' },
    { id: 'ROU', name: 'ルーマニア' },
    { id: 'SVK', name: 'スロバキア' },
    { id: 'TUR', name: 'トルコ' },
    { id: 'UKR', name: 'ウクライナ' },
    { id: 'USA', name: 'アメリカ' },
    { id: 'UZB', name: 'ウズベキスタン' },
    { id: 'KGZ', name: 'キルギス' },
    { id: 'ARM', name: 'アルメニア' },
  ],

  // 主催団体（大会の organizer に指定。どれにも当てはまらない場合は 'その他'）
  organizers: ['JAWA', 'AJAF', 'JAF', '日本腕相撲協会', 'その他'],

  formats: {
    double: 'トーナメント（敗者復活戦あり）',
    league: 'リーグ戦',
  },

  // 利き腕・階級・体重は大会の出場記録から自動で判定します
  athletes: [
    { id: 'a01', name: '佐藤 剛', nameEn: 'Tsuyoshi Sato', nationality: 'JPN', nickname: '鉄腕', team: 'TEAM IRON', photo: 'img/athletes/a01.svg', bio: 'トップロールを得意とするスピード型。両腕で上位を狙うオールラウンダー。' },
    { id: 'a02', name: '鈴木 拓海', nameEn: 'Takumi Suzuki', nationality: 'JPN', nickname: '湘南の鷹', team: '湘南アームクラブ', photo: 'img/athletes/a02.svg', bio: 'フックでの粘り強さに定評。長期戦に持ち込むと強い。' },
    { id: 'a03', name: '高橋 誠', nameEn: 'Makoto Takahashi', nationality: 'JPN', nickname: 'フックマスター', team: 'GRIP FACTORY', photo: 'img/athletes/a03.svg', bio: '右腕一本で勝負するベテラン。深いフックからの引き込みが武器。' },
    { id: 'a04', name: '田中 健太', nameEn: 'Kenta Tanaka', nationality: 'JPN', nickname: 'ケンタ', team: 'TEAM IRON', photo: 'img/athletes/a04.svg', bio: '左腕専門の若手。スタートの反応速度はクラス随一。' },
    { id: 'a05', name: '伊藤 翼', nameEn: 'Tsubasa Ito', nationality: 'JPN', nickname: 'ウィング', team: '浪速腕相撲道場', photo: 'img/athletes/a05.svg', bio: '手首の強さを活かしたトップロールで勝負する。' },
    { id: 'a06', name: '渡辺 大地', nameEn: 'Daichi Watanabe', nationality: 'JPN', nickname: '大地', team: 'KOBE ARMS', photo: 'img/athletes/a06.svg', bio: '軽量ながらパワーのあるファイター。左腕の伸びが著しい。' },
    { id: 'a07', name: '山本 光', nameEn: 'Hikaru Yamamoto', nationality: 'JPN', nickname: '閃光', team: '名古屋アームファイターズ', photo: 'img/athletes/a07.svg', bio: '一瞬で決めるスピード勝負が持ち味。右腕専門。' },
    { id: 'a08', name: '中村 蓮', nameEn: 'Ren Nakamura', nationality: 'JPN', nickname: 'サウスポー蓮', team: 'GRIP FACTORY', photo: 'img/athletes/a08.svg', bio: '左腕専門のテクニシャン。サイドプレッシャーで相手を崩す。' },
    { id: 'a09', name: '小林 悠真', nameEn: 'Yuma Kobayashi', nationality: 'JPN', nickname: 'ユーマ', team: '湘南アームクラブ', photo: 'img/athletes/a09.svg', bio: '競技を始めて間もない成長株。両腕で経験を積んでいる。' },
    { id: 'a10', name: '加藤 陸', nameEn: 'Riku Kato', nationality: 'JPN', nickname: '陸王', team: '博多アームズ', photo: 'img/athletes/a10.svg', bio: '-70kg級から増量し、秋季オープンで-80kg級に挑戦。' },
    { id: 'a11', name: '吉田 大輔', nameEn: 'Daisuke Yoshida', nationality: 'JPN', nickname: '浪速の怪物', team: '浪速腕相撲道場', photo: 'img/athletes/a11.svg', bio: '-80kg級の主役。圧倒的なサイドプレッシャー。' },
    { id: 'a12', name: '山田 翔', nameEn: 'Sho Yamada', nationality: 'JPN', nickname: 'ショー', team: 'KOBE ARMS', photo: 'img/athletes/a12.svg', bio: '右腕のパワーファイター。' },
    { id: 'a13', name: '佐々木 隆', nameEn: 'Takashi Sasaki', nationality: 'JPN', nickname: 'ザ・ウォール', team: '杜の都AWC', photo: 'img/athletes/a13.svg', bio: '守りの堅さから「壁」と呼ばれる。左腕がやや得意。' },
    { id: 'a14', name: '山口 亮', nameEn: 'Ryo Yamaguchi', nationality: 'JPN', nickname: 'リョウ', team: '名古屋アームファイターズ', photo: 'img/athletes/a14.svg', bio: '右腕専門。フックの深さが武器。' },
    { id: 'a15', name: '松本 拳', nameEn: 'Ken Matsumoto', nationality: 'JPN', nickname: '拳', team: 'TEAM IRON', photo: 'img/athletes/a15.svg', bio: '両腕とも安定した成績を残す実力者。' },
    { id: 'a16', name: '井上 勇気', nameEn: 'Yuki Inoue', nationality: 'JPN', nickname: 'ブレイブ', team: '博多アームズ', photo: 'img/athletes/a16.svg', bio: '気持ちの強さが持ち味の右腕ファイター。' },
    { id: 'a17', name: '木村 剛志', nameEn: 'Takeshi Kimura', nationality: 'JPN', nickname: 'ブル', team: 'GRIP FACTORY', photo: 'img/athletes/a17.svg', bio: '突進力のあるパワー型。' },
    { id: 'a18', name: '林 健一', nameEn: 'Kenichi Hayashi', nationality: 'JPN', nickname: 'ケンイチ', team: '杜の都AWC', photo: 'img/athletes/a18.svg', bio: '減量して-80kg級に参戦する技巧派。' },
    { id: 'a19', name: '清水 隼人', nameEn: 'Hayato Shimizu', nationality: 'JPN', nickname: 'ハヤブサ', team: 'KOBE ARMS', photo: 'img/athletes/a19.svg', bio: '左腕のエース。全日本では右腕にも出場。' },
    { id: 'a20', name: '山崎 豪', nameEn: 'Go Yamazaki', nationality: 'JPN', nickname: '豪腕', team: '浪速腕相撲道場', photo: 'img/athletes/a20.svg', bio: '名前の通りの豪腕。左腕が主戦場。' },
    { id: 'a21', name: '森 直樹', nameEn: 'Naoki Mori', nationality: 'JPN', nickname: 'ナオキ', team: '湘南アームクラブ', photo: 'img/athletes/a21.svg', bio: '左腕専門。粘り強い試合運び。' },
    { id: 'a22', name: '池田 武', nameEn: 'Takeru Ikeda', nationality: 'JPN', nickname: 'タケル', team: '博多アームズ', photo: 'img/athletes/a22.svg', bio: '左腕専門の若手。' },
    { id: 'a23', name: '橋本 美咲', nameEn: 'Misaki Hashimoto', nationality: 'JPN', nickname: 'ミサキ', team: 'TEAM IRON', photo: 'img/athletes/a23.svg', bio: '女子-60kg級のエース。両腕で優勝争いに絡む。' },
    { id: 'a24', name: '石川 由衣', nameEn: 'Yui Ishikawa', nationality: 'JPN', nickname: 'ユイ', team: 'GRIP FACTORY', photo: 'img/athletes/a24.svg', bio: 'テクニカルなフックが持ち味の右腕専門。' },
    { id: 'a25', name: '吉村 葵', nameEn: 'Aoi Yoshimura', nationality: 'JPN', nickname: 'アオイ', team: '博多アームズ', photo: 'img/athletes/a25.svg', bio: '左腕が得意な両腕選手。' },
    { id: 'a26', name: '前田 彩', nameEn: 'Aya Maeda', nationality: 'JPN', nickname: 'アヤ', team: '杜の都AWC', photo: 'img/athletes/a26.svg', bio: '右腕専門。今季急成長中。' },
    { id: 'a27', name: '藤田 さくら', nameEn: 'Sakura Fujita', nationality: 'JPN', nickname: 'さくら', team: '名古屋アームファイターズ', photo: 'img/athletes/a27.svg', bio: 'スピードのあるトップロールが武器。' },
    { id: 'a28', name: '岡田 莉子', nameEn: 'Riko Okada', nationality: 'JPN', nickname: 'レフティ莉子', team: 'KOBE ARMS', photo: 'img/athletes/a28.svg', bio: '左腕専門のサウスポー。' },
    { id: 'a29', name: '後藤 千尋', nameEn: 'Chihiro Goto', nationality: 'JPN', nickname: 'チヒロ', team: '湘南アームクラブ', photo: 'img/athletes/a29.svg', bio: '軽量級から参戦。全日本で右腕にも挑戦。' },
    { id: 'a30', name: '長谷川 萌', nameEn: 'Moe Hasegawa', nationality: 'JPN', nickname: 'モエ', team: '浪速腕相撲道場', photo: 'img/athletes/a30.svg', bio: '左腕専門。粘りのある試合運び。' },
    { id: 'a31', name: '西村 和也', nameEn: 'Kazuya Nishimura', nationality: 'JPN', nickname: '二刀流', team: 'KOBE ARMS', photo: 'img/athletes/a31.svg', bio: '-70kg級と-80kg級の右腕に同時エントリーする挑戦者。' },
    { id: 'a32', name: '原田 拓真', nameEn: 'Takuma Harada', nationality: 'JPN', nickname: '階級荒らし', team: '名古屋アームファイターズ', photo: 'img/athletes/a32.svg', bio: '左腕で-70kg級と-80kg級の両方に出場。上の階級でも臆さない。' },

    // ---- 本番データ ----
    { id: 'p01', name: '加藤 佳男', nameEn: 'KATOH YOSHIO', nationality: 'JPN', nickname: ['マスクマン', 'カタン紳士'], team: 'U.A.G TOKYO', photo: 'img/athletes/p01.jpg', bio: 'このサイトの発案者です。吊り選手で、親指を落としながら攻めるのが基本です。左利きの選手です。キン肉マン系のマスクをよくかぶります。' },
    { id: 'p02', name: '青〇 大輝', nameEn: 'AOYAMA TAIKI', nationality: 'JPN', nickname: '', team: 'Team Cobra', photo: 'img/athletes/noimage.svg', bio: '' },
    { id: 'p03', name: '渋谷 友和', nameEn: 'SIBUYA TOMOKAZU', nationality: 'JPN', nickname: '', team: '北腕会', photo: 'img/athletes/p03.jpg', bio: '' },
    { id: 'p04', name: '齋〇 輝', nameEn: 'SAITO HIKARU', nationality: 'JPN', nickname: '', team: '', photo: 'img/athletes/noimage.svg', bio: '' },
    // 出典: 第5回 MUSCLE GATE マッスルゲート アームレスリングトーナメント_石島サップデータ.xlsx「選手備考」シート
    { id: 'p05', name: '石島 サップ', nameEn: 'ISHIJIMA SAP', nationality: 'JPN', nickname: 'メイちゃん', team: '豪傑道場', photo: 'img/athletes/p05.jpg', bio: '初速が速い選手です。フックのように攻めるか、抵抗がある場合は相手の手首を攻めます。' },
    { id: 'p06', name: '齋藤 翔唯', nameEn: 'SAITO KAI', nationality: 'JPN', nickname: '', team: '剛腕一族', photo: 'img/athletes/p06.jpg', bio: '' },
    { id: 'p07', name: '菅原 守', nameEn: 'SUGAWARA MAMORU', nationality: 'JPN', nickname: '', team: '真青同盟', photo: 'img/athletes/p07.jpg', bio: '' },
    // 出典: 第24回オールジャパンアームレスリング選手権大会_石島サップデータ.xlsx「選手備考」シート
    { id: 'p08', name: '辰巳 直紀', nameEn: 'TATSUMI NAOKI', nationality: 'JPN', nickname: '', team: 'OSSU!!', photo: 'img/athletes/p08.jpg', bio: '腕相撲日本一の選手です。ストラップより素握りのほうが強いです。' },
    { id: 'p09', name: '東口 宜弘', nameEn: 'HIGASHIGUCHI YOSHIHIRO', nationality: 'JPN', nickname: '', team: '太腕', photo: 'img/athletes/p09.jpg', bio: '' },

    // ---- 本番データ：2025 WAF世界選手権 出場選手（渋谷 p03・加藤 p01 は上記） ----
    { id: 'w01', name: 'アレクサンドル シャプキン', nameEn: 'Aleksander Shapkin', nationality: 'NEU', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w02', name: 'ステファン エルー', nameEn: 'Stephane Heroux', nationality: 'CAN', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w03', name: 'イェヴヘン ヴァクラ', nameEn: 'Yevhen Vakula', nationality: 'UKR', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w04', name: 'アルチョム ボンダレフ', nameEn: 'Artiom Bondarev', nationality: 'MDA', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w05', name: 'ベルトラン トラヴァリーニ', nameEn: 'Bertrand Travaglini', nationality: 'FRA', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w06', name: 'フラヴィウ ゴイア', nameEn: 'Flaviu Goia', nationality: 'ROU', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w07', name: 'メヴリュト トゥルグト', nameEn: 'Mevlut Turgut', nationality: 'TUR', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w08', name: 'キリル ボグダンスキ', nameEn: 'Kiril Bogdanski', nationality: 'BGR', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w09', name: 'ミハイル ソロニン', nameEn: 'Mikhail Solonin', nationality: 'KAZ', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w10', name: 'オスマン コプズ', nameEn: 'Osman Kopuz', nationality: 'TUR', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w11', name: 'マムカ リパルタシュヴィリ', nameEn: 'Mamuka Lipartashvili', nationality: 'GEO', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w12', name: 'アフメト セキン', nameEn: 'Ahmet Sekin', nationality: 'DEU', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w13', name: 'チトレシュワル ロウレンバム', nameEn: 'Chitreshwar Lourembam', nationality: 'IND', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w14', name: 'ロバート ベリー', nameEn: 'Robert Belley', nationality: 'USA', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w15', name: 'ノダル ギウナシュヴィリ', nameEn: 'Nodar Giunashvili', nationality: 'GEO', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w16', name: 'ロレンソ ビリャール', nameEn: 'Lorenzo Villar', nationality: 'ESP', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w17', name: 'アレクス プレツアシュヴィリ', nameEn: 'Aleks Pretsuashvili', nationality: 'GEO', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w18', name: 'ヤーノシュ ドブロチ', nameEn: 'Janos Dobrocsi', nationality: 'HUN', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w19', name: 'アレクサンドル ウォシュール', nameEn: 'Alexandre Waucheul', nationality: 'FRA', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w20', name: 'ジャバ ゲティアシュヴィリ', nameEn: 'Jaba Getiashvili', nationality: 'GEO', team: '', photo: 'img/athletes/w20.jpg', bio: '吊り選手です。親指を落とす攻め方をしますが、横にも行けます。手首を返す攻めもします（WAF2025右腕決勝）。' },
    { id: 'w21', name: 'アンドレアス ヘフナー', nameEn: 'Andreas Hoeffner', nationality: 'DEU', team: '', photo: 'img/athletes/w21.jpg', bio: '吊り選手です。親指を落としながら、バックプレッシャーをかけます。リーチが長く、低い姿勢で戦います。' },
    { id: 'w22', name: 'ダニエル アンドロナケ', nameEn: 'Daniel Andronache', nationality: 'ROU', team: '', photo: 'img/athletes/w22.jpg', bio: '左利きの吊り選手です。リーチが長く、手首と親指を上げて相手を攻めます。親指の壁が強いです。左右どちらも同じ戦略で、ストラップのほうが強いと思われます。左腕では、最初に引いて攻めるやり方も使います。' },
    { id: 'w23', name: 'ドミトリー ドクチャエフ', nameEn: 'Dmitriy Dokuchaev', nationality: 'UZB', team: '', photo: 'img/athletes/w23.jpg', bio: '吊り選手です。親指を落とす攻めが基本で、左腕では手首を攻めます。リーチが長く、スピードも速いです。相手に手を握らせず、レフリーズグリップに持ち込むことが多いです。リストの強いAndreas Hoeffnerさんには、初手の親指を落とす攻めでは勝てません。2024年WAFの右腕決勝では、バックプレッシャーをかける攻めに切り替えていました。' },
    { id: 'w24', name: 'ヤロミール ベルネク', nameEn: 'Jaromir Belunek', nationality: 'CZE', team: '', photo: 'img/athletes/w24.jpg', bio: '吊り選手です。初手の引きが強く、スピードもあります。最初の握りで上を取りにいく選手で、ワーニングも辞さない姿勢です。リストはぎりぎりまで粘ります。握りでは高さを取ります。' },
    { id: 'w25', name: 'オスバルド アラニス', nameEn: 'Osvaldo Alanis', nationality: 'MEX', team: '', photo: 'img/athletes/w25.jpg', bio: '吊りの選手です。手首を返す攻めをします。スタート時に審判を見ます。' },
    { id: 'w26', name: 'プラチド ジョーコ', nameEn: 'Placido Gioco', nationality: 'ITA', team: '', photo: 'img/athletes/w26.jpg', bio: '吊りの選手です。まず手首を返し、さらに親指を落とす攻めをします。リーチが長い選手には噛みも使います。親指を落とす攻めだけの場合もあります。' },
    { id: 'w27', name: 'ペトル ヴェヴォダ', nameEn: 'Petr Vevoda', nationality: 'CZE', team: '', photo: 'img/athletes/w27.jpg', bio: 'サイドの選手です。まず親指を押さえて横に移動し、そこから親指を落とします。' },
    { id: 'w28', name: 'ディミタル ユレフ', nameEn: 'Dimitar Yulev', nationality: 'BGR', team: '', photo: 'img/athletes/w28.jpg', bio: '吊りの選手です。相手の手首を返す攻めをします。握りのときにバックプレッシャーをかけます。' },
    { id: 'w29', name: '大高 宏英', nameEn: 'Hirohide Otaka', nationality: 'JPN', team: '誠腕道場', photo: 'img/athletes/w29.jpg', bio: '噛み選手です。不利な姿勢でも長い時間耐える力があります。' },
    { id: 'w30', name: 'ハラルド シグモンド', nameEn: 'Harald Sigmond', nationality: 'NOR', team: '', photo: 'img/athletes/w30.jpg', bio: '右：吊り選手です。親指を落とす攻め方で、握りの引きがあります。握るときに顔を手に近づけます。WAF2025の右腕2回戦では噛みも使っていました。\n左：吊り選手です。親指を落とす攻め方です。耐えるときは、親指を上げる選手と思われます。' },
    { id: 'w31', name: 'アルノー ブリヤン', nameEn: 'Arnaud Brillant', nationality: 'FRA', team: '', photo: 'img/athletes/w31.jpg', bio: '吊りの選手です。相手の手首を返す攻めをします。スピードもあります。握りでは高さを取ります。' },
    { id: 'w32', name: 'レネ ショルツェ', nameEn: 'Rene Scholze', nationality: 'DEU', team: '', photo: 'img/athletes/w32.jpg', bio: 'スタート時に審判を見ます。スタートに自信がある選手と思われます。親指を持ち、攻める面積は小さいです。' },
    { id: 'w33', name: 'ジェム アクタン', nameEn: 'Cem Aktan', nationality: 'TUR', team: '', photo: 'img/athletes/w33.jpg', bio: '握りで上を取ります。' },
    { id: 'w34', name: 'ピエトロ スキラッチ', nameEn: 'Pietro Schillaci', nationality: 'ITA', team: '', photo: 'img/athletes/w34.jpg', bio: '吊りの選手です。相手の手首を折るタイプの攻め方と思われます。' },
    { id: 'w35', name: 'アレクサンドル サラジャヌ', nameEn: 'Alexandru Salajanu', nationality: 'ROU', team: '', photo: 'img/athletes/w35.jpg', bio: '吊り選手です。親指を落とす攻め方が基本ですが、横にも行けます。プッシュもあります。セットアップのときに引きます。' },
    { id: 'w36', name: 'ガントルガ デシグスレン', nameEn: 'Gantulga Deshigsuren', nationality: 'MNG', team: '', photo: 'img/athletes/w36.jpg', bio: '試合では終始劣勢だったため、攻め方はわかりません。' },
    { id: 'w37', name: 'マウリシオ メンデス', nameEn: 'Mauricio Mendes', nationality: 'BRA', team: '', photo: 'img/athletes/w37.jpg', bio: '握りの位置が高く、顔も手に近づけます。親指を落とす攻め方をしますが、噛みにも対応できます。' },
    { id: 'w38', name: 'レナート トロクスラー', nameEn: 'Troxler Renato', nationality: 'CHE', team: '', photo: 'img/athletes/w38.jpg', bio: 'サイドの選手です。ストラップのほうが強いです。' },
    { id: 'w39', name: 'エンフタイヴァン ハドガー', nameEn: 'Enkhtaivan Khadgaa', nationality: 'MNG', team: '', photo: 'img/athletes/w39.jpg', bio: 'スタートが強い選手です。スタート時に審判の口元を見ます。力もありそうです。' },
    { id: 'w40', name: 'マトゥシュ フルビク', nameEn: 'Matus Hlubik', nationality: 'SVK', team: '', photo: 'img/athletes/w40.jpg', bio: '噛み選手です。リーチがあります。握り方によっては、握りでごねます。親指を落とす攻めをします。' },
    { id: 'w41', name: 'ジョージ ドブリン', nameEn: 'George Dobrin', nationality: 'ROU', team: '', photo: 'img/athletes/w41.jpg', bio: '吊り選手です。リーチが長いです。低い姿勢から体重を乗せるイメージです。親指を離さない力が強いです。握りのときに後ろに引く選手です。' },
    { id: 'w42', name: 'ヴァズゲン ソゴヤン', nameEn: 'Vazgen Soghoyan', nationality: 'USA', team: '', photo: 'img/athletes/w42.jpg', bio: '噛みの選手です。握りの高さは低めです。スピードはありそうです。' },
    { id: 'w43', name: 'イブラギム ティムルジエフ', nameEn: 'Ibragim Timurziev', nationality: 'NEU', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w44', name: 'シャミル トコフ', nameEn: 'Shamil Tokov', nationality: 'NEU', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w45', name: 'ホー リー', nameEn: 'Ho- Ri-', nationality: 'JPN', team: 'OSSU!!', photo: 'img/athletes/noimage.svg' },
    { id: 'w46', name: 'マリアン オルザニカ', nameEn: 'Marian Orzanica', nationality: 'ROU', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w47', name: 'アイガルス ルズギス', nameEn: 'Aigars Ruzgis', nationality: 'LVA', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w48', name: 'コスミン ロマネスク', nameEn: 'Cosmin Romanescu', nationality: 'ROU', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w49', name: 'フィル ラスムセン', nameEn: 'Phil Rasmussen', nationality: 'AUS', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w50', name: 'ミロスラフ トドロフ', nameEn: 'Miroslav Todorov', nationality: 'BGR', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w51', name: 'ジュリアン ポワベルオー', nameEn: 'Julien Poisbelaud', nationality: 'FRA', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w52', name: 'アルベルト ムヌエラ', nameEn: 'Alberto Munuera', nationality: 'ESP', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w53', name: 'イェナル クルチ', nameEn: 'Yenal Kilic', nationality: 'TUR', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w54', name: 'イジー ポフネク', nameEn: 'Jiri Pohunek', nationality: 'CZE', team: '', photo: 'img/athletes/w54.jpg', bio: '吊り選手です。リーチが長く、高い姿勢から落とすイメージです。' },
    { id: 'w55', name: 'ミカエル ショーディン', nameEn: 'Mikael Sjodin', nationality: 'NOR', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w56', name: 'ヤン ニーモ', nameEn: 'Jan Nymo', nationality: 'NOR', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w57', name: 'ダヴィト イヴァニゼ', nameEn: 'Davit Ivanidze', nationality: 'GEO', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w58', name: '飯野 和哉', nameEn: 'Iino Kazuki', nationality: 'JPN', team: '中野アームスピリッツ', photo: 'img/athletes/w58.jpg' },
    { id: 'w59', name: 'アンドリアン ゲツ', nameEn: 'Andrian Ghetu', nationality: 'MDA', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w60', name: 'プリンス ディール', nameEn: 'Prince Dhir', nationality: 'IND', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w61', name: '植松 政憲', nameEn: 'Uematsu Masanori', nationality: 'JPN', team: 'SAFARI', photo: 'img/athletes/noimage.svg' },
    { id: 'w62', name: 'ビジナ マリアシュヴィリ', nameEn: 'Bidzina Mariashvili', nationality: 'GEO', team: '', photo: 'img/athletes/noimage.svg' },
    { id: 'w63', name: 'ルイス バレラ', nameEn: 'Louis Barrera', nationality: 'USA', team: '', photo: 'img/athletes/noimage.svg' },

    // ---- 本番データ：2024 WAF世界選手権 出場選手（既存選手と英字氏名・国が同じ選手は追加せず） ----
    { id: 'w64', name: 'イムレ ヴァーイ', nameEn: 'Imre Valyi', nationality: 'HUN', team: '', photo: 'img/athletes/w64.jpg', bio: '手を離さない選手です。攻め方は親指を落とすタイプです。初速は遅めに見えます。体と一緒にリストと腕も動かします。' },
    { id: 'w65', name: 'アザマト オトルバエフ', nameEn: 'Azamat Otorbaev', nationality: 'KGZ', team: '', photo: 'img/athletes/w65.jpg', bio: '吊り選手です。相手の手首を返す攻めをします。ストラップには弱いのかもしれません。' },
    { id: 'w66', name: 'アルマン ピロヤン', nameEn: 'Arman Piroyan', nationality: 'ARM', team: '', photo: 'img/athletes/w66.jpg', bio: '吊り選手です。リーチは短いですが、初手の引きが強いです。相手の親指を寝かせるスタイルで、スピードもあります。' },
  ],

  tournaments: [
    // ---- 本番データ ----
    {
      // 階級は -80kg と判断
      id: 'waf2024', organizer: 'その他', name: '2024 WAFアームレスリング 世界選手権', short: '2024 WAF世界選手権',
      date: '2024-08-15', endDate: '2024-08-25', venue: 'モルドバ・キシナウ', level: '世界大会',
      weighIns: {},
      divisions: [
        {
          // 出典: 2024_WAF_マスターズ-80kg左右.xlsx「入力データ」シート
          classId: 'MM80', arm: 'L', format: 'double',
          entries: ['w22', 'w21', 'w23', 'w24', 'w64', 'w65', 'w35', 'w54', 'w29', 'w30'],
          matches: [
            // 試合詳細(detail)の出典: WAF2024-80㎏詳細.xlsx「大会詳細」シート（fouls / warnings は [a, b]）
            // 本戦1回戦
            { id: 'waf2024-MM80-L-W1-1', round: 'W', no: 1, slot: 1, a: 'w24', b: 'w30', winner: 'w24', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Jaromir Belunekさんの圧勝でした。' } },
            { id: 'waf2024-MM80-L-W1-2', round: 'W', no: 1, slot: 2, a: 'w23', b: 'w35', winner: 'w23', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'あり', remark: 'Dmitriy Dokuchaevさんがレフリーズグリップに持ち込み、スピードで圧勝しました。手首を攻めていました。' } },
            { id: 'waf2024-MM80-L-W1-3', round: 'W', no: 1, slot: 3, a: 'w29', b: 'w64', winner: 'w64', method: 'ピン勝ち',
              detail: { fouls: [1, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Imre Valyiさんの基本スタイルどおりの勝ち方でした。' } },
            { id: 'waf2024-MM80-L-W1-4', round: 'W', no: 1, slot: 4, a: 'w21', b: 'w65', winner: 'w21', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Andreas Hoeffnerさんの圧勝でした。' } },
            { id: 'waf2024-MM80-L-W1-5', round: 'W', no: 1, slot: 5, a: 'w54', b: 'w22', winner: 'w22', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'なし', remark: 'Daniel Andronacheさんの圧勝でした。' } },
            // 本戦2回戦
            { id: 'waf2024-MM80-L-W2-1', round: 'W', no: 2, slot: 1, a: 'w24', b: 'w23', winner: 'w23', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'あり', remark: 'Dmitriy Dokuchaevさんが勝ちましたが、力は拮抗していました。長い映像区間のため、協議・再セットを含む可能性があります。' } },
            { id: 'waf2024-MM80-L-W2-2', round: 'W', no: 2, slot: 2, a: 'w64', b: 'w21', winner: 'w21', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Andreas Hoeffnerさんの圧勝でした。' } },
            // 本戦3回戦
            { id: 'waf2024-MM80-L-W3-1', round: 'W', no: 3, slot: 1, a: 'w22', b: 'w23', winner: 'w22', method: '2ファール勝ち',
              detail: { fouls: [0, 2], warnings: [0, 2], strapRequest: 'なし', strap: 'あり', refereeGrip: 'あり', remark: 'Dmitriy Dokuchaevさんが握りでごねて1ファールとなり、レフリーズグリップになりました。さらにレフリーズグリップでもごねて、2ファール目を取られました。長い映像区間のため、協議・再セットを含む可能性があります。' } },
            // 本戦決勝
            { id: 'waf2024-MM80-L-WF', round: 'WF', no: 0, slot: 1, a: 'w21', b: 'w22', winner: 'w22', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'なし', remark: 'Daniel Andronacheさんが優勢のまま勝ちました。ストラップのほうが強いのかもしれません。part01の00:50:43で、両選手の手に黄色のストラップが巻かれていることを確認しました。' } },
            // 敗者復活戦1回戦
            { id: 'waf2024-MM80-L-L1-1', round: 'L', no: 1, slot: 1, a: 'w30', b: 'w35', winner: 'w35', method: 'ピン勝ち',
              detail: { fouls: [1, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'なし', remark: 'Alexandru Salajanuさんが終始優勢でしたが、親指を完全には倒せていませんでした。' } },
            { id: 'waf2024-MM80-L-L1-2', round: 'L', no: 1, slot: 2, a: 'w29', b: 'w65', winner: 'w65', method: 'ピン勝ち',
              detail: { fouls: [1, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Azamat Otorbaevさんの勝ちです。相手の手首を返す攻めで、型どおりの勝ち方でした。' } },
            // 敗者復活戦2回戦
            { id: 'waf2024-MM80-L-L2-1', round: 'L', no: 2, slot: 1, a: 'w54', b: 'w24', winner: 'w24', method: '2ファール勝ち',
              detail: { fouls: [2, 0], warnings: [2, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'なし', remark: '初回の握りで1ファールがありました。ストラップは両陣営ともあえて選びました。Jiri Pohunekさんが優勢でしたが、相手の攻めでエルボーダウンとなり負けました。' } },
            { id: 'waf2024-MM80-L-L2-2', round: 'L', no: 2, slot: 2, a: 'w64', b: 'w35', winner: 'w64', method: 'ピン勝ち',
              detail: { fouls: [1, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'なし', remark: '初回はプッシュの展開でした。' } },
            // 敗者復活戦3回戦
            { id: 'waf2024-MM80-L-L3-1', round: 'L', no: 3, slot: 1, a: 'w65', b: 'w23', winner: 'w23', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Dmitriy Dokuchaevさんの圧勝でした。スピードも速かったです。' } },
            { id: 'waf2024-MM80-L-L3-2', round: 'L', no: 3, slot: 2, a: 'w24', b: 'w64', winner: 'w24', method: 'ピン勝ち',
              detail: { fouls: [1, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Jaromir Belunekさんが終始圧倒して勝ちました。' } },
            // 敗者復活戦4回戦
            { id: 'waf2024-MM80-L-L4-1', round: 'L', no: 4, slot: 1, a: 'w23', b: 'w24', winner: 'w23', method: 'ピン勝ち',
              detail: { fouls: [1, 1], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'あり', remark: 'Dmitriy Dokuchaevさんのほうがリーチが長いため、上を取っていました。最後は手首を狙われました。長い映像区間のため、協議・再セットを含む可能性があります。' } },
            // 敗者復活戦決勝
            { id: 'waf2024-MM80-L-LF', round: 'LF', no: 0, slot: 1, a: 'w21', b: 'w23', winner: 'w21', method: '2ファール勝ち',
              detail: { fouls: [0, 2], warnings: [0, 1], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Andreas Hoeffnerさんが優勢でした。Dmitriy Dokuchaevさんは上を取っていました。' } },
            // 決勝
            { id: 'waf2024-MM80-L-F', round: 'F', no: 0, slot: 1, a: 'w22', b: 'w21', winner: 'w22', method: 'ピン勝ち',
              detail: { fouls: [0, 1], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'なし', remark: 'Daniel Andronacheさんは、ストラップのほうが強くなるのかもしれません。' } },
          ],
        },
        {
          // 出典: 2024_WAF_マスターズ-80kg左右.xlsx「入力データ」シート
          classId: 'MM80', arm: 'R', format: 'double',
          entries: ['w21', 'w23', 'w40', 'w30', 'w41', 'w24', 'w29', 'w22', 'w64', 'w65', 'w54', 'w66'],
          matches: [
            // 試合詳細(detail)の出典: WAF2024-80㎏詳細.xlsx「大会詳細」シート（fouls / warnings は [a, b]）
            // 本戦1回戦
            { id: 'waf2024-MM80-R-W1-1', round: 'W', no: 1, slot: 1, a: 'w22', b: 'w30', winner: 'w30', method: 'ピン勝ち',
              detail: { fouls: [1, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'なし', remark: '1回目はお互いに手が外れ、ストラップに持ち込んだ印象です。' } },
            { id: 'waf2024-MM80-R-W1-2', round: 'W', no: 1, slot: 2, a: 'w66', b: 'w40', winner: 'w40', method: '2ファール勝ち',
              detail: { fouls: [2, 0], warnings: [1, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'あり', remark: 'Arman Piroyanさんのほうがスピードがあり、終始攻めていましたが、ファールで負けました。' } },
            { id: 'waf2024-MM80-R-W1-3', round: 'W', no: 1, slot: 3, a: 'w64', b: 'w54', winner: 'w64', method: '2ファール勝ち',
              detail: { fouls: [0, 2], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'なし', remark: 'Jiri Pohunekさんが攻めていました。' } },
            { id: 'waf2024-MM80-R-W1-4', round: 'W', no: 1, slot: 4, a: 'w23', b: 'w41', winner: 'w23', method: 'ピン勝ち',
              detail: { fouls: [1, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'なし', remark: 'Dmitriy Dokuchaevさんが終始圧倒していました。' } },
            { id: 'waf2024-MM80-R-W1-5', round: 'W', no: 1, slot: 5, a: 'w65', b: 'w21', winner: 'w21', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Andreas Hoeffnerさんの圧勝でした。親指を落としながら、バックプレッシャーをかけていました。' } },
            { id: 'waf2024-MM80-R-W1-6', round: 'W', no: 1, slot: 6, a: 'w29', b: 'w24', winner: 'w24', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'あり', remark: 'お互いに初手で握り合いになり、レフリーズグリップになりました。' } },
            // 本戦2回戦
            { id: 'waf2024-MM80-R-W2-1', round: 'W', no: 2, slot: 1, a: 'w30', b: 'w40', winner: 'w40', method: '2ファール勝ち',
              detail: { fouls: [2, 0], warnings: [2, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Harald Sigmondさんは、2回のワーニング（1ファール分）と1ファールで反則負けとなりました。試合は、吊りのHarald Sigmondさんが噛みのMatus Hlubikさんに対抗する展開でした。' } },
            { id: 'waf2024-MM80-R-W2-2', round: 'W', no: 2, slot: 2, a: 'w64', b: 'w23', winner: 'w23', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Dmitriy Dokuchaevさんの圧勝でした。スピードで上回っていました。' } },
            { id: 'waf2024-MM80-R-W2-3', round: 'W', no: 2, slot: 3, a: 'w21', b: 'w24', winner: 'w21', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'なし', remark: 'Andreas Hoeffnerさんが終始優勢でした。Jaromir Belunekさんがストラップで耐える場面もありました。' } },
            // 本戦3回戦
            { id: 'waf2024-MM80-R-W3-1', round: 'W', no: 3, slot: 1, a: 'w40', b: 'w23', winner: 'w23', method: 'ピン勝ち',
              detail: { fouls: [1, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'あり', remark: 'Dmitriy Dokuchaevさんの圧勝でした。スピードで上回っていました。初回の判定は、プロテストがなくても覆りました。part03からpart04へ続く対戦で、決着はpart04に映っています。' } },
            // 本戦決勝
            { id: 'waf2024-MM80-R-WF', round: 'WF', no: 0, slot: 1, a: 'w21', b: 'w23', winner: 'w21', method: '2ファール勝ち',
              detail: { fouls: [0, 2], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Dmitriy Dokuchaevさんはファール負けでしたが、上を取れず、終始圧倒されていました。逃げるようにファールでごまかしていました。初手のスピードはAndreas Hoeffnerさんのほうが速かったです。' } },
            // 敗者復活戦1回戦
            { id: 'waf2024-MM80-R-L1-1', round: 'L', no: 1, slot: 1, a: 'w22', b: 'w66', winner: 'w22', method: '2ファール勝ち',
              detail: { fouls: [1, 2], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'なし', remark: 'Daniel Andronacheさんは初手で浮いているように見えましたが、ファールは取られていません。' } },
            { id: 'waf2024-MM80-R-L1-2', round: 'L', no: 1, slot: 2, a: 'w54', b: 'w41', winner: 'w41', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'リーチの長い選手同士の吊り勝負でした。' } },
            { id: 'waf2024-MM80-R-L1-3', round: 'L', no: 1, slot: 3, a: 'w65', b: 'w29', winner: 'w29', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'なし', remark: 'ストラップなしではAzamat Otorbaevさんが優勢でしたが、ストラップ後は大高 宏英さんの圧勝でした。' } },
            // 敗者復活戦2回戦
            { id: 'waf2024-MM80-R-L2-1', round: 'L', no: 2, slot: 1, a: 'w30', b: 'w64', winner: 'w30', method: 'ピン勝ち',
              detail: { fouls: [0, 1], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Harald Sigmondさんの圧勝でした。' } },
            { id: 'waf2024-MM80-R-L2-2', round: 'L', no: 2, slot: 2, a: 'w24', b: 'w22', winner: 'w24', method: 'ピン勝ち',
              detail: { fouls: [1, 1], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'あり', remark: 'レフリーズグリップの試合でした。Jaromir Belunekさんの引きが強く、終始圧倒していました。' } },
            { id: 'waf2024-MM80-R-L2-3', round: 'L', no: 2, slot: 3, a: 'w41', b: 'w29', winner: 'w41', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: '握りの瞬間からお互いに力が入っていました。George Dobrinさんの親指を離さない姿勢が強かったです。' } },
            // 敗者復活戦3回戦
            { id: 'waf2024-MM80-R-L3-1', round: 'L', no: 3, slot: 1, a: 'w40', b: 'w24', winner: 'w40', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Jaromir Belunekさんは初手で攻めましたが、相手のほうが力が上だったため耐えられ、逆に負けました。' } },
            { id: 'waf2024-MM80-R-L3-2', round: 'L', no: 3, slot: 2, a: 'w30', b: 'w41', winner: 'w30', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Harald Sigmondさんが親指を落としただけで圧勝しました。' } },
            // 敗者復活戦4回戦
            { id: 'waf2024-MM80-R-L4-1', round: 'L', no: 4, slot: 1, a: 'w40', b: 'w30', winner: 'w40', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'あり', remark: 'Matus Hlubikさんが握りでごねていました。' } },
            // 敗者復活戦決勝
            { id: 'waf2024-MM80-R-LF', round: 'LF', no: 0, slot: 1, a: 'w23', b: 'w40', winner: 'w23', method: 'ピン勝ち',
              detail: { fouls: [1, 1], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'あり', remark: 'お互いにレフリーズグリップに持ち込む傾向があり、どちらも初手のスピードに懸けていました。ノーコンテストが1回ありました。準決勝（SEMIFINAL）／PROTESTの表示もありましたが、Dmitriy Dokuchaevさんのピン勝ちで確定しました。' } },
            // 決勝
            { id: 'waf2024-MM80-R-F', round: 'F', no: 0, slot: 1, a: 'w21', b: 'w23', winner: 'w21', method: '2ファール勝ち',
              detail: { fouls: [0, 2], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'あり', remark: 'レフリーズグリップの試合でした。初手はノーコンテストでした。レフリーズグリップにすると、Dmitriy Dokuchaevさんのほうが先手を取れるようです。' } },
          ],
        },
      ],
    },
    {
      // 出場選手のみ登録（試合結果・順位は未入力のため matches は空）
      id: 'waf2025', organizer: 'その他', name: '2025 WAFアームレスリング 世界選手権', short: '2025 WAF世界選手権',
      date: '2025-09-10', endDate: '2025-09-23', venue: 'ブルガリア・アルベナ', level: '世界大会',
      weighIns: {},
      divisions: [
        {
          // 出典: WAF2025_マスターズ-70kg左右 .xlsx「本データ」シート（決勝の勝者はご指摘により修正）
          classId: 'MM70', arm: 'L', format: 'double',
          entries: ['w01', 'w02', 'w03', 'w04', 'w05', 'w06', 'w07', 'w08', 'w09', 'w10', 'p03', 'w11', 'w12', 'w13', 'w14', 'w15'],
          matches: [
            // 本戦1回戦
            { id: 'waf2025-MM70-L-W1-1', round: 'W', no: 1, slot: 1, a: 'w15', b: 'w07', winner: 'w07', method: 'ファール裁定の可能性' },
            { id: 'waf2025-MM70-L-W1-2', round: 'W', no: 1, slot: 2, a: 'w10', b: 'w08', winner: 'w08', method: 'ピン勝ち' },
            { id: 'waf2025-MM70-L-W1-3', round: 'W', no: 1, slot: 3, a: 'w11', b: 'w06', winner: 'w11', method: '判定詳細未確認' },
            { id: 'waf2025-MM70-L-W1-4', round: 'W', no: 1, slot: 4, a: 'w01', b: 'w14', winner: 'w01', method: 'ピン勝ち' },
            { id: 'waf2025-MM70-L-W1-5', round: 'W', no: 1, slot: 5, a: 'w05', b: 'w09', winner: 'w05', method: 'ピン勝ちの可能性' },
            { id: 'waf2025-MM70-L-W1-6', round: 'W', no: 1, slot: 6, a: 'w13', b: 'w02', winner: 'w02', method: 'ファール裁定の可能性' },
            { id: 'waf2025-MM70-L-W1-7', round: 'W', no: 1, slot: 7, a: 'w12', b: 'p03', winner: 'p03', method: 'ファール裁定の可能性' },
            { id: 'waf2025-MM70-L-W1-8', round: 'W', no: 1, slot: 8, a: 'w04', b: 'w03', winner: 'w03', method: '判定詳細未確認' },
            // 本戦2回戦
            { id: 'waf2025-MM70-L-W2-1', round: 'W', no: 2, slot: 1, a: 'w07', b: 'w08', winner: 'w08', method: 'ピン勝ちの可能性' },
            { id: 'waf2025-MM70-L-W2-2', round: 'W', no: 2, slot: 2, a: 'w11', b: 'w01', winner: 'w01', method: 'ファール裁定の可能性' },
            { id: 'waf2025-MM70-L-W2-3', round: 'W', no: 2, slot: 3, a: 'w05', b: 'w02', winner: 'w02', method: 'ピン勝ち' },
            { id: 'waf2025-MM70-L-W2-4', round: 'W', no: 2, slot: 4, a: 'p03', b: 'w03', winner: 'w03', method: '判定詳細未確認' },
            // 本戦3回戦
            { id: 'waf2025-MM70-L-W3-1', round: 'W', no: 3, slot: 1, a: 'w08', b: 'w01', winner: 'w01', method: 'ピンの可能性' },
            { id: 'waf2025-MM70-L-W3-2', round: 'W', no: 3, slot: 2, a: 'w02', b: 'w03', winner: 'w02', method: 'ピンの可能性' },
            // 本戦決勝
            { id: 'waf2025-MM70-L-WF', round: 'WF', no: 0, slot: 1, a: 'w01', b: 'w02', winner: 'w01', method: 'ピンの可能性' },
            // 敗者復活戦1回戦
            { id: 'waf2025-MM70-L-L1-1', round: 'L', no: 1, slot: 1, a: 'w15', b: 'w10', winner: 'w10', method: 'ピン勝ちの可能性' },
            { id: 'waf2025-MM70-L-L1-2', round: 'L', no: 1, slot: 2, a: 'w06', b: 'w14', winner: 'w06', method: 'ピン勝ち' },
            { id: 'waf2025-MM70-L-L1-3', round: 'L', no: 1, slot: 3, a: 'w09', b: 'w13', winner: 'w09', method: '決着方法未確定' },
            { id: 'waf2025-MM70-L-L1-4', round: 'L', no: 1, slot: 4, a: 'w12', b: 'w04', winner: 'w04', method: 'ピン／ファールの別は未確定' },
            // 敗者復活戦2回戦
            { id: 'waf2025-MM70-L-L2-1', round: 'L', no: 2, slot: 1, a: 'w07', b: 'w11', winner: 'w07', method: 'ピンの可能性' },
            { id: 'waf2025-MM70-L-L2-2', round: 'L', no: 2, slot: 2, a: 'w05', b: 'p03', winner: 'w05', method: '長時間の攻防後に決着（詳細不明）' },
            { id: 'waf2025-MM70-L-L2-3', round: 'L', no: 2, slot: 3, a: 'w10', b: 'w06', winner: 'w06', method: 'ピンの可能性' },
            { id: 'waf2025-MM70-L-L2-4', round: 'L', no: 2, slot: 4, a: 'w09', b: 'w04', winner: 'w04', method: 'ピンの可能性' },
            // 敗者復活戦3回戦
            { id: 'waf2025-MM70-L-L3-1', round: 'L', no: 3, slot: 1, a: 'w08', b: 'w03', winner: 'w03', method: '決着方法未確定' },
            { id: 'waf2025-MM70-L-L3-2', round: 'L', no: 3, slot: 2, a: 'w07', b: 'w05', winner: 'w05', method: 'ピンの可能性' },
            // 敗者復活戦4回戦
            { id: 'waf2025-MM70-L-L4-1', round: 'L', no: 4, slot: 1, a: 'w06', b: 'w04', winner: 'w04', method: 'ピン／ファールの別は未確定' },
            { id: 'waf2025-MM70-L-L4-2', round: 'L', no: 4, slot: 2, a: 'w03', b: 'w05', winner: 'w03', method: 'ピンの可能性' },
            // 敗者復活戦5回戦
            { id: 'waf2025-MM70-L-L5-1', round: 'L', no: 5, slot: 1, a: 'w04', b: 'w03', winner: 'w03', method: '決着方法未確定' },
            // 敗者復活戦決勝
            { id: 'waf2025-MM70-L-LF', round: 'LF', no: 0, slot: 1, a: 'w02', b: 'w03', winner: 'w02', method: '決着方法未確定' },
            // 決勝
            { id: 'waf2025-MM70-L-F', round: 'F', no: 0, slot: 1, a: 'w01', b: 'w02', winner: 'w01', method: 'ピン勝ち', note: 'Excelでは勝者 Heroux・決着方法未確定。ご指摘により Shapkin のピン勝ちに修正' },
          ],
        },
        {
          // 出典: WAF2025_マスターズ-70kg左右 .xlsx「本データ」シート（一部の試合が欠けているため incomplete）
          classId: 'MM70', arm: 'R', format: 'double', incomplete: true,
          note: '本戦2〜3回戦の一部、敗者復活戦3回戦以降の一部、敗者復活戦決勝（Aleksander Shapkin vs Aleks Pretsuashvili）のデータが未登録です。',
          entries: ['w16', 'w01', 'w17', 'w03', 'w06', 'p03', 'w18', 'w02', 'w04', 'w14', 'w05', 'w19', 'w10', 'w07', 'w12', 'w09', 'w11', 'w13'],
          matches: [
            // 本戦1回戦
            { id: 'waf2025-MM70-R-W1-1', round: 'W', no: 1, slot: 1, a: 'w07', b: 'w13', winner: 'w07', method: '不戦勝' },
            { id: 'waf2025-MM70-R-W1-2', round: 'W', no: 1, slot: 2, a: 'w19', b: 'w01', winner: 'w01', method: 'ピン勝ち' },
            { id: 'waf2025-MM70-R-W1-3', round: 'W', no: 1, slot: 3, a: 'w03', b: 'w05', winner: 'w03', method: 'ピン勝ち' },
            { id: 'waf2025-MM70-R-W1-4', round: 'W', no: 1, slot: 4, a: 'w10', b: 'w11', winner: 'w10', method: '2ファール勝ち' },
            { id: 'waf2025-MM70-R-W1-5', round: 'W', no: 1, slot: 5, a: 'w18', b: 'w16', winner: 'w16', method: 'ピン勝ち' },
            { id: 'waf2025-MM70-R-W1-6', round: 'W', no: 1, slot: 6, a: 'w06', b: 'w09', winner: 'w06', method: 'ピン勝ち' },
            { id: 'waf2025-MM70-R-W1-7', round: 'W', no: 1, slot: 7, a: 'w14', b: 'w17', winner: 'w17', method: 'ピン勝ち' },
            { id: 'waf2025-MM70-R-W1-8', round: 'W', no: 1, slot: 8, a: 'w12', b: 'w02', winner: 'w02', method: '2ファール勝ち' },
            { id: 'waf2025-MM70-R-W1-9', round: 'W', no: 1, slot: 9, a: 'p03', b: 'w04', winner: 'p03', method: '2ファール勝ち', note: 'レフリーズグリップ' },
            // 本戦2回戦
            { id: 'waf2025-MM70-R-W2-1', round: 'W', no: 2, slot: 1, a: 'w07', b: 'w01', winner: 'w01', method: '不戦勝', note: '勝者は未確認（候補の選手を勝者として登録）' },
            { id: 'waf2025-MM70-R-W2-2', round: 'W', no: 2, slot: 2, a: 'w03', b: 'w10', winner: 'w03', method: '不明', note: '勝者は未確認（候補の選手を勝者として登録）' },
            { id: 'waf2025-MM70-R-W2-3', round: 'W', no: 2, slot: 3, a: 'w16', b: 'w06', winner: 'w16', method: '不明' },
            // 本戦3回戦
            { id: 'waf2025-MM70-R-W3-1', round: 'W', no: 3, slot: 1, a: 'p03', b: 'w01', winner: 'w01', method: '不明' },
            { id: 'waf2025-MM70-R-W3-2', round: 'W', no: 3, slot: 2, a: 'w03', b: 'w16', winner: 'w16', method: '不明' },
            // 本戦4回戦
            { id: 'waf2025-MM70-R-W4-1', round: 'W', no: 4, slot: 1, a: 'w17', b: 'w01', winner: 'w01', method: 'ルーザーポジション勝ち' },
            // 本戦決勝
            { id: 'waf2025-MM70-R-WF', round: 'WF', no: 0, slot: 1, a: 'w01', b: 'w16', winner: 'w16', method: '不明', note: 'ストラップ／Excelでは「決勝戦」表記。両者とも無敗のため本戦決勝として登録／動画の終了時刻はExcelの値が不正のため未設定' },
            // 敗者復活戦1回戦
            { id: 'waf2025-MM70-R-L1-1', round: 'L', no: 1, slot: 1, a: 'w13', b: 'w19', winner: 'w19', method: '不明' },
            { id: 'waf2025-MM70-R-L1-2', round: 'L', no: 1, slot: 2, a: 'w05', b: 'w11', winner: 'w05', method: '2ファール勝ち', note: 'レフリーズグリップ' },
            { id: 'waf2025-MM70-R-L1-3', round: 'L', no: 1, slot: 3, a: 'w18', b: 'w09', winner: 'w18', method: 'ピン勝ち', note: 'ストラップ' },
            { id: 'waf2025-MM70-R-L1-4', round: 'L', no: 1, slot: 4, a: 'w14', b: 'w12', winner: 'w14', method: '不明' },
            // 敗者復活戦2回戦
            { id: 'waf2025-MM70-R-L2-1', round: 'L', no: 2, slot: 1, a: 'w04', b: 'w07', winner: 'w04', method: '不明' },
            { id: 'waf2025-MM70-R-L2-2', round: 'L', no: 2, slot: 2, a: 'w10', b: 'w06', winner: 'w06', method: 'ピン勝ち' },
            { id: 'waf2025-MM70-R-L2-3', round: 'L', no: 2, slot: 3, a: 'w02', b: 'w19', winner: 'w02', method: 'ピン勝ち', note: 'ストラップ' },
            { id: 'waf2025-MM70-R-L2-4', round: 'L', no: 2, slot: 4, a: 'w05', b: 'w18', winner: 'w18', method: 'ピン勝ち' },
            { id: 'waf2025-MM70-R-L2-5', round: 'L', no: 2, slot: 5, a: 'w14', b: 'p03', winner: 'p03', method: 'ピン勝ち' },
            // 敗者復活戦3回戦
            { id: 'waf2025-MM70-R-L3-1', round: 'L', no: 3, slot: 1, a: 'w03', b: 'w04', winner: 'w03', method: 'ピン勝ち', note: 'レフリーズグリップ、ストラップ' },
            { id: 'waf2025-MM70-R-L3-2', round: 'L', no: 3, slot: 2, a: 'w06', b: 'w02', winner: 'w06', method: '不明' },
            // 敗者復活戦5回戦
            { id: 'waf2025-MM70-R-L5-1', round: 'L', no: 5, slot: 1, a: 'w18', b: 'w17', winner: 'w17', method: '不明' },
            // 敗者復活戦6回戦
            { id: 'waf2025-MM70-R-L6-1', round: 'L', no: 6, slot: 1, a: 'w06', b: 'w17', winner: 'w17', method: '不明', note: 'Excelでは「敗者復活決勝戦」表記。この後 Shapkin（本戦決勝の敗者）が敗者復活戦に回るため、敗者復活戦決勝ではないと判断' },
            // 決勝
            { id: 'waf2025-MM70-R-F', round: 'F', no: 0, slot: 1, a: 'w16', b: 'w01', winner: 'w16', method: '不明', note: 'ストラップ／Excelでは「決勝戦2回戦」表記。本戦決勝で敗れた Shapkin との決勝として登録' },
          ],
        },
        {
          // 出典: WAF2025_80kg_left_interim_analysis.xlsx（動画前半の中間集計。決勝は未登録）
          // Nodar Giunashvili の不戦勝2件（本戦1回戦・敗者復活1回戦）は出場者外のため不戦として除外
          classId: 'MM80', arm: 'L', format: 'double',
          entries: ['w20', 'w21', 'w22', 'w23', 'w24', 'w25', 'w26', 'w27', 'w28', 'w29', 'w30', 'w31', 'w32', 'w33', 'p01', 'w34', 'w35', 'w36', 'w37', 'w38', 'w39'],
          matches: [
            // 本戦1回戦
            // 本戦1回戦の試合詳細(detail)の出典: WAF2025-80㎏詳細.xlsx「大会詳細」シート（fouls / warnings は [a, b]）
            { id: 'waf2025-MM80-L-W1-1', round: 'W', no: 1, slot: 1, a: 'w28', b: 'w21', winner: 'w21', method: '2ファール勝ち',
              detail: { fouls: [2, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Andreas Hoeffnerさんが親指を落とすと、相手はそれに対抗して結果的にファールになりました。これを2回繰り返しました。' } },
            { id: 'waf2025-MM80-L-W1-2', round: 'W', no: 1, slot: 2, a: 'w29', b: 'w39', winner: 'w29', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: '大高 宏英さんのセオリーどおりの勝ち方です。' } },
            { id: 'waf2025-MM80-L-W1-3', round: 'W', no: 1, slot: 3, a: 'w33', b: 'w22', winner: 'w22', method: 'ピン勝ち',
              detail: { fouls: [0, 1], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'あり', remark: 'Daniel Andronacheさんのセオリーどおりの勝ち方でした。' } },
            { id: 'waf2025-MM80-L-W1-4', round: 'W', no: 1, slot: 4, a: 'w38', b: 'w30', winner: 'w30', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'あり', remark: 'Harald Sigmondさんのセオリーどおりの勝ち方です。' } },
            { id: 'waf2025-MM80-L-W1-5', round: 'W', no: 1, slot: 5, a: 'w34', b: 'w32', winner: 'w34', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Rene Scholzeさんが最初は攻めていましたが、のちに返されました。' } },
            { id: 'waf2025-MM80-L-W1-6', round: 'W', no: 1, slot: 6, a: 'w23', b: 'w37', winner: 'w23', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Dmitriy Dokuchaevさんのスピード勝ちです。' } },
            { id: 'waf2025-MM80-L-W1-7', round: 'W', no: 1, slot: 7, a: 'w20', b: 'w27', winner: 'w20', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'あり', remark: 'Jaba Getiashviliさんは相手の上に乗せる形で勝ちました。' } },
            { id: 'waf2025-MM80-L-W1-8', round: 'W', no: 1, slot: 8, a: 'p01', b: 'w36', winner: 'p01', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: '加藤 佳男さんのセオリーどおりの勝ち方です。' } },
            { id: 'waf2025-MM80-L-W1-9', round: 'W', no: 1, slot: 9, a: 'w31', b: 'w24', winner: 'w24', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Arnaud Brillantさんは下から逃げましたが、審判に判定され、そのまま負けとなりました。' } },
            // 本戦2回戦
            { id: 'waf2025-MM80-L-W2-1', round: 'W', no: 2, slot: 1, a: 'w25', b: 'w26', winner: 'w26', method: 'ピン勝ち',
              detail: { fouls: [1, 0], warnings: [1, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Placido Giocoさんは親指を落とす攻めでした。手首を返さないのは珍しいです。' } },
            { id: 'waf2025-MM80-L-W2-2', round: 'W', no: 2, slot: 2, a: 'w35', b: 'w21', winner: 'w21', method: 'ピン勝ち',
              detail: { fouls: [1, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Andreas Hoeffnerさんが親指を落とし、さらに手首も返して勝ちました。' } },
            { id: 'waf2025-MM80-L-W2-3', round: 'W', no: 2, slot: 3, a: 'w29', b: 'w22', winner: 'w22', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'なし', remark: 'Daniel Andronacheさんのセオリーどおりの勝ち方でした。' } },
            { id: 'waf2025-MM80-L-W2-4', round: 'W', no: 2, slot: 4, a: 'w30', b: 'w34', winner: 'w30', method: 'ピン勝ち',
              detail: { fouls: [0, 1], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Harald Sigmondさんのセオリーどおりの勝ち方です。' } },
            { id: 'waf2025-MM80-L-W2-5', round: 'W', no: 2, slot: 5, a: 'w23', b: 'w20', winner: 'w20', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'あり', remark: 'Dmitriy Dokuchaevさんの作戦どおりの試合の流れでしたが、Jaba Getiashviliさんが強すぎました。' } },
            { id: 'waf2025-MM80-L-W2-6', round: 'W', no: 2, slot: 6, a: 'p01', b: 'w24', winner: 'w24', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'あり', remark: '最初は握り合いになりました。加藤 佳男さんはスタートで先手を取られ、力でも負けていました。' } },
            // 本戦3回戦
            { id: 'waf2025-MM80-L-W3-1', round: 'W', no: 3, slot: 1, a: 'w26', b: 'w21', winner: 'w21', method: 'ピン勝ち',
              detail: { fouls: [1, 1], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'あり', remark: 'Andreas Hoeffnerさんが手首を返す攻めで勝ちました。' } },
            { id: 'waf2025-MM80-L-W3-2', round: 'W', no: 3, slot: 2, a: 'w22', b: 'w30', winner: 'w22', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Daniel Andronacheさんが、最初に引いて攻めるやり方で勝ちました。' } },
            { id: 'waf2025-MM80-L-W3-3', round: 'W', no: 3, slot: 3, a: 'w20', b: 'w24', winner: 'w20', method: '2ファール勝ち',
              detail: { fouls: [0, 2], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'あり', remark: 'Jaromir Belunekさんが終始圧倒していましたが、2ファール負けです。' } },
            // 本戦4回戦
            { id: 'waf2025-MM80-L-W4-1', round: 'W', no: 4, slot: 1, a: 'w21', b: 'w22', winner: 'w21', method: '2ファール勝ち',
              detail: { fouls: [1, 2], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'なし', remark: 'Daniel Andronacheさんが最後は優勢でしたが、2ファール負けになりました。双方に攻防があり、どちらが勝ってもおかしくない試合でした。' } },
            // 本戦決勝
            { id: 'waf2025-MM80-L-WF', round: 'WF', no: 0, slot: 1, a: 'w20', b: 'w21', winner: 'w21', method: '2ファール勝ち',
              detail: { fouls: [2, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'なし', remark: 'Jaba Getiashviliさんが圧倒していましたが、2ファール負けです。' } },
            // 敗者復活戦1回戦
            // 敗者復活戦の試合詳細(detail)の出典: WAF2025-80㎏詳細.xlsx「大会詳細」シート（fouls / warnings は [a, b]）
            { id: 'waf2025-MM80-L-L1-1', round: 'L', no: 1, slot: 1, a: 'w39', b: 'w33', winner: 'w33', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Cem Aktanさんの圧勝でした。' } },
            { id: 'waf2025-MM80-L-L1-2', round: 'L', no: 1, slot: 2, a: 'w38', b: 'w32', winner: 'w32', method: '2ファール勝ち',
              detail: { fouls: [2, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Troxler Renatoさんの2ファール負けです。' } },
            { id: 'waf2025-MM80-L-L1-3', round: 'L', no: 1, slot: 3, a: 'w37', b: 'w27', winner: 'w27', method: '2ファール勝ち',
              detail: { fouls: [2, 1], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'あり', remark: 'お互いにレフリーズグリップでファールを取られています。' } },
            { id: 'waf2025-MM80-L-L1-4', round: 'L', no: 1, slot: 4, a: 'w36', b: 'w31', winner: 'w31', method: 'ピン勝ち',
              detail: { fouls: [0, 1], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Arnaud Brillantさんの圧勝でした。' } },
            // 敗者復活戦2回戦
            { id: 'waf2025-MM80-L-L2-1', round: 'L', no: 2, slot: 1, a: 'w25', b: 'w35', winner: 'w25', method: '2ファール勝ち',
              detail: { fouls: [1, 2], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'あり', remark: 'Osvaldo Alanisさんの得意な攻めが目立つ試合でした。' } },
            { id: 'waf2025-MM80-L-L2-2', round: 'L', no: 2, slot: 2, a: 'w29', b: 'w34', winner: 'w29', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'あり', remark: '大高 宏英さんの圧勝でした。' } },
            { id: 'waf2025-MM80-L-L2-3', round: 'L', no: 2, slot: 3, a: 'w23', b: 'p01', winner: 'w23', method: 'ピン勝ち',
              detail: { fouls: [1, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'あり', remark: 'Dmitriy Dokuchaevさんがレフリーズグリップに持ち込み、そのまま圧勝した試合でした。' } },
            { id: 'waf2025-MM80-L-L2-4', round: 'L', no: 2, slot: 4, a: 'w28', b: 'w33', winner: 'w28', method: '2ファール勝ち',
              detail: { fouls: [0, 2], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: '1回目はDimitar Yulevさんのウィナーズポジションでも問題なかったはずです。' } },
            { id: 'waf2025-MM80-L-L2-5', round: 'L', no: 2, slot: 5, a: 'w32', b: 'w27', winner: 'w27', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'なし', remark: 'ストラップにすると、攻防が逆転する試合でした。' } },
            // 敗者復活戦3回戦
            { id: 'waf2025-MM80-L-L3-1', round: 'L', no: 3, slot: 1, a: 'w31', b: 'w26', winner: 'w26', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'あり', remark: 'Placido Giocoさんの圧勝でした。' } },
            { id: 'waf2025-MM80-L-L3-2', round: 'L', no: 3, slot: 2, a: 'w30', b: 'w24', winner: 'w24', method: '2ファール勝ち',
              detail: { fouls: [2, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'あり', remark: 'Harald Sigmondさんの2ファール負けです。' } },
            { id: 'waf2025-MM80-L-L3-3', round: 'L', no: 3, slot: 3, a: 'w25', b: 'w29', winner: 'w25', method: 'ピン勝ち',
              detail: { fouls: [0, 1], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'あり', remark: 'Osvaldo Alanisさんのセオリーどおりの勝ち方です。' } },
            { id: 'waf2025-MM80-L-L3-4', round: 'L', no: 3, slot: 4, a: 'w23', b: 'w28', winner: 'w23', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'あり', remark: 'Dmitriy Dokuchaevさんのセオリーどおりの勝ち方です。' } },
            { id: 'waf2025-MM80-L-L3-5', round: 'L', no: 3, slot: 5, a: 'w27', b: 'w22', winner: 'w22', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'なし', remark: 'Daniel Andronacheさんの圧勝でした。' } },
            // 敗者復活戦4回戦
            { id: 'waf2025-MM80-L-L4-1', round: 'L', no: 4, slot: 1, a: 'w26', b: 'w24', winner: 'w24', method: 'ピン勝ち',
              detail: { fouls: [0, 1], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'あり', remark: 'Jaromir Belunekさんの攻め勝ちです。1回目は親指を寝かせられずファールになりましたが、2回目で親指を落とすことができ、勝ちました。' } },
            { id: 'waf2025-MM80-L-L4-2', round: 'L', no: 4, slot: 2, a: 'w25', b: 'w23', winner: 'w23', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Dmitriy Dokuchaevさんの圧勝でした。' } },
            // 敗者復活戦5回戦（Excelでは「4回戦目」表記。Belunekが同じ回戦で2試合になるため次の回戦として登録）
            { id: 'waf2025-MM80-L-L5-1', round: 'L', no: 5, slot: 1, a: 'w22', b: 'w24', winner: 'w22', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'なし', remark: 'Daniel Andronacheさんのセオリーどおりの勝ち方でした。' } },
            // 敗者復活戦準決勝
            { id: 'waf2025-MM80-L-L6-1', round: 'L', no: 6, slot: 1, label: '敗者復活戦準決勝', a: 'w23', b: 'w22', winner: 'w22', method: '2ファール勝ち',
              detail: { fouls: [2, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'あり', remark: 'Daniel Andronacheさんの粘り勝ちでした。' } },
            // 敗者復活戦決勝
            { id: 'waf2025-MM80-L-LF', round: 'LF', no: 0, slot: 1, a: 'w20', b: 'w22', winner: 'w20', method: '2ファール勝ち',
              detail: { fouls: [0, 2], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Daniel Andronacheさんはストラップに持ち込もうとしましたが、2回とも下で抜いたためファールを取られ、負けました。' } },
            // 決勝（Excel 43・44行目）
            { id: 'waf2025-MM80-L-F', round: 'F', no: 0, slot: 1, a: 'w21', b: 'w20', winner: 'w20', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'なし', remark: 'Jaba Getiashviliさんの圧勝でした。' } },
            { id: 'waf2025-MM80-L-F2', round: 'F2', no: 0, slot: 1, a: 'w21', b: 'w20', winner: 'w20', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Jaba Getiashviliさんの圧勝でした。' } },
          ],
        },
        {
          // 出典: WAF2025_マスターズ80㎏右.xlsx（一部の試合が欠けているため incomplete）
          classId: 'MM80', arm: 'R', format: 'double', incomplete: true,
          note: '本戦3回戦以降・敗者復活戦2回戦以降・敗者復活戦決勝のデータが未登録です。',
          entries: ['w21', 'w20', 'w37', 'w22', 'w25', 'w28', 'w29', 'w23', 'w38', 'w30', 'w27', 'w40', 'w41', 'w34', 'w31', 'w42', 'w26', 'p01', 'w39', 'w33', 'w32', 'w24', 'w36'],
          matches: [
            // 本戦1回戦
            // 試合詳細(detail)の出典: WAF2025-80㎏詳細.xlsx「大会詳細」シート（fouls / warnings は [a, b]）
            { id: 'waf2025-MM80-R-W1-1', round: 'W', no: 1, slot: 1, a: 'w25', b: 'w36', winner: 'w25', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Osvaldo Alanisさんの圧勝でした。' } },
            { id: 'waf2025-MM80-R-W1-2', round: 'W', no: 1, slot: 2, a: 'w22', b: 'w20', winner: 'w20', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'なし', remark: 'Jaba Getiashviliさんの圧勝でした。' } },
            { id: 'waf2025-MM80-R-W1-3', round: 'W', no: 1, slot: 3, a: 'w28', b: 'w38', winner: 'w28', method: '不戦勝',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: '不戦勝です。' } },
            { id: 'waf2025-MM80-R-W1-4', round: 'W', no: 1, slot: 4, a: 'w24', b: 'w26', winner: 'w26', method: 'ピン勝ち',
              detail: { fouls: [0, 1], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Placido Giocoさんの圧勝でした。' } },
            { id: 'waf2025-MM80-R-W1-5', round: 'W', no: 1, slot: 5, a: 'w32', b: 'w40', winner: 'w40', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Matus Hlubikさんのスピード勝ちでした。' } },
            { id: 'waf2025-MM80-R-W1-6', round: 'W', no: 1, slot: 6, a: 'w34', b: 'w42', winner: 'w42', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'あり', remark: 'Vazgen Soghoyanさんのスピード勝ちでした。' } },
            { id: 'waf2025-MM80-R-W1-7', round: 'W', no: 1, slot: 7, a: 'w23', b: 'w21', winner: 'w21', method: 'ピン勝ち',
              detail: { fouls: [1, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'なし', remark: 'Andreas Hoeffnerさんの圧勝でした。' } },
            { id: 'waf2025-MM80-R-W1-8', round: 'W', no: 1, slot: 8, a: 'w33', b: 'w37', winner: 'w37', method: 'ピン勝ち',
              detail: { fouls: [1, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Mauricio Mendesさんの圧勝でした。' } },
            { id: 'waf2025-MM80-R-W1-9', round: 'W', no: 1, slot: 9, a: 'w30', b: 'w41', winner: 'w30', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Harald Sigmondさんの圧勝でした。' } },
            { id: 'waf2025-MM80-R-W1-10', round: 'W', no: 1, slot: 10, a: 'w31', b: 'w39', winner: 'w31', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Arnaud Brillantさんの圧勝でした。' } },
            { id: 'waf2025-MM80-R-W1-11', round: 'W', no: 1, slot: 11, a: 'w27', b: 'w29', winner: 'w27', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Petr Vevodaさんの圧勝でした。' } },
            // 本戦2回戦
            { id: 'waf2025-MM80-R-W2-1', round: 'W', no: 2, slot: 1, a: 'p01', b: 'w25', winner: 'w25', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Osvaldo Alanisさんの圧勝でした。スタートで勝っていました。元のExcelでは「本戦1回戦目」と表記されていましたが、Osvaldo Alanisさんの2試合目のため2回戦として登録しています（加藤 佳男さんは1回戦シード）。' } },
            { id: 'waf2025-MM80-R-W2-2', round: 'W', no: 2, slot: 2, a: 'w20', b: 'w28', winner: 'w20', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'あり', remark: 'Jaba Getiashviliさんの圧勝でした。' } },
            { id: 'waf2025-MM80-R-W2-3', round: 'W', no: 2, slot: 3, a: 'w26', b: 'w40', winner: 'w40', method: '2ファール勝ち',
              detail: { fouls: [2, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'あり', remark: 'Placido Giocoさんは終始攻めていましたが、結果的にファールで負けました。プロテストがありました。' } },
            { id: 'waf2025-MM80-R-W2-4', round: 'W', no: 2, slot: 4, a: 'w42', b: 'w21', winner: 'w21', method: '2ファール勝ち',
              detail: { fouls: [2, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: 'Vazgen Soghoyanさんの2ファール負けでした。' } },
            { id: 'waf2025-MM80-R-W2-5', round: 'W', no: 2, slot: 5, a: 'w37', b: 'w30', winner: 'w37', method: 'ピン勝ち',
              detail: { fouls: [1, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: '1回目はMauricio Mendesさんの親指落としでしたが、2回目はHarald Sigmondさんが噛みに行き、Mauricio Mendesさんは噛みに対抗して勝ちました。' } },
            { id: 'waf2025-MM80-R-W2-6', round: 'W', no: 2, slot: 6, a: 'w31', b: 'w27', winner: 'w27', method: '2ファール勝ち',
              detail: { fouls: [2, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: '拮抗していましたが、Arnaud Brillantさんがエルボーアップ・エルボーダウンで負けました。' } },
            // 敗者復活戦1回戦
            { id: 'waf2025-MM80-R-L1-1', round: 'L', no: 1, slot: 1, a: 'w36', b: 'w22', winner: 'w22', method: '2ファール勝ち',
              detail: { fouls: [2, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: '動画が不鮮明なため、詳しい判断ができません。' } },
            { id: 'waf2025-MM80-R-L1-2', round: 'L', no: 1, slot: 2, a: 'w38', b: 'w24', winner: 'w38', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'あり', remark: 'Troxler Renatoさんの圧勝でした。' } },
            // 決勝
            { id: 'waf2025-MM80-R-F', round: 'F', no: 0, slot: 1, a: 'w21', b: 'w20', winner: 'w21', method: '2ファール勝ち',
              detail: { fouls: [0, 2], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'なし', remark: 'Jaba Getiashviliさんの2ファール負けです。ただ、Jaba Getiashviliさんはストラップでは優勢でした。' } },
          ],
        },
        {
          // 出典: WAF2025_マスターズ90kg左右.xlsx（一部の試合が欠けているため incomplete）
          classId: 'MM90', arm: 'R', format: 'double', incomplete: true,
          note: '本戦2回戦のうち2試合（Jan Nymo・Mikael Sjodin が敗れた試合）のデータが未登録です。',
          entries: ['w43', 'w44', 'w45', 'w46', 'w47', 'w48', 'w49', 'w50', 'w51', 'w52', 'w53', 'w54', 'w55', 'w56', 'w57', 'w58', 'w59', 'w60'],
          matches: [
            // 本戦1回戦
            { id: 'waf2025-MM90-R-W1-1', round: 'W', no: 1, slot: 1, a: 'w56', b: 'w60', winner: 'w56', method: '2ファール勝ち', note: 'レフリーズグリップ' },
            { id: 'waf2025-MM90-R-W1-2', round: 'W', no: 1, slot: 2, a: 'w46', b: 'w47', winner: 'w46', method: 'ピン勝ち', note: 'ストラップ' },
            { id: 'waf2025-MM90-R-W1-3', round: 'W', no: 1, slot: 3, a: 'w55', b: 'w59', winner: 'w55', method: 'ピン勝ち' },
            { id: 'waf2025-MM90-R-W1-4', round: 'W', no: 1, slot: 4, a: 'w43', b: 'w49', winner: 'w43', method: '2ファール勝ち' },
            { id: 'waf2025-MM90-R-W1-5', round: 'W', no: 1, slot: 5, a: 'w50', b: 'w58', winner: 'w50', method: 'ピン勝ち' },
            { id: 'waf2025-MM90-R-W1-6', round: 'W', no: 1, slot: 6, a: 'w48', b: 'w53', winner: 'w48', method: 'ピン勝ち' },
            { id: 'waf2025-MM90-R-W1-7', round: 'W', no: 1, slot: 7, a: 'w57', b: 'w54', winner: 'w54', method: '不戦勝' },
            { id: 'waf2025-MM90-R-W1-8', round: 'W', no: 1, slot: 8, a: 'w44', b: 'w52', winner: 'w44', method: 'ピン勝ち', note: 'レフリーズグリップ' },
            { id: 'waf2025-MM90-R-W1-9', round: 'W', no: 1, slot: 9, a: 'w51', b: 'w45', winner: 'w45', method: 'ピン勝ち', note: 'レフリーズグリップ' },
            // 本戦2回戦
            { id: 'waf2025-MM90-R-W2-1', round: 'W', no: 2, slot: 1, a: 'w50', b: 'w48', winner: 'w48', method: '不明', note: '動画不安定' },
            { id: 'waf2025-MM90-R-W2-2', round: 'W', no: 2, slot: 2, a: 'w54', b: 'w44', winner: 'w44', method: '不明', note: '動画不安定' },
            // 本戦3回戦
            { id: 'waf2025-MM90-R-W3-1', round: 'W', no: 3, slot: 1, a: 'w45', b: 'w46', winner: 'w46', method: 'ピン勝ち' },
            { id: 'waf2025-MM90-R-W3-2', round: 'W', no: 3, slot: 2, a: 'w43', b: 'w48', winner: 'w43', method: 'ピン勝ち' },
            // 本戦4回戦
            { id: 'waf2025-MM90-R-W4-1', round: 'W', no: 4, slot: 1, a: 'w44', b: 'w46', winner: 'w44', method: 'ピン勝ち', note: 'ストラップ' },
            // 本戦決勝
            { id: 'waf2025-MM90-R-WF', round: 'WF', no: 0, slot: 1, a: 'w43', b: 'w44', winner: 'w43', method: 'ピン勝ち', note: 'チームプレイの可能性あり' },
            // 敗者復活戦1回戦
            { id: 'waf2025-MM90-R-L1-1', round: 'L', no: 1, slot: 1, a: 'w60', b: 'w47', winner: 'w47', method: 'ピン勝ち', note: 'レフリーズグリップ／Excelでは「本戦2回戦」表記。両者とも本戦1回戦の敗者のため敗者復活戦1回戦として登録' },
            { id: 'waf2025-MM90-R-L1-2', round: 'L', no: 1, slot: 2, a: 'w59', b: 'w49', winner: 'w49', method: 'ウィナーズポジション', note: '勝ち方は要確認（Excelの記載のまま）' },
            { id: 'waf2025-MM90-R-L1-3', round: 'L', no: 1, slot: 3, a: 'w58', b: 'w53', winner: 'w53', method: 'ウィナーズポジション', note: '勝ち方は要確認（Excelの記載のまま）' },
            { id: 'waf2025-MM90-R-L1-4', round: 'L', no: 1, slot: 4, a: 'w57', b: 'w52', winner: 'w52', method: '不戦勝' },
            // 敗者復活戦2回戦
            { id: 'waf2025-MM90-R-L2-1', round: 'L', no: 2, slot: 1, a: 'w51', b: 'w56', winner: 'w51', method: '2ファール勝ち', note: 'レフリーズグリップ' },
            { id: 'waf2025-MM90-R-L2-2', round: 'L', no: 2, slot: 2, a: 'w55', b: 'w50', winner: 'w50', method: 'ピン勝ち' },
            { id: 'waf2025-MM90-R-L2-3', round: 'L', no: 2, slot: 3, a: 'w54', b: 'w47', winner: 'w47', method: 'ピン勝ち' },
            { id: 'waf2025-MM90-R-L2-4', round: 'L', no: 2, slot: 4, a: 'w49', b: 'w53', winner: 'w49', method: 'ピン勝ち', note: 'ストラップ' },
            // 敗者復活戦3回戦
            { id: 'waf2025-MM90-R-L3-1', round: 'L', no: 3, slot: 1, a: 'w52', b: 'w45', winner: 'w45', method: 'ピン勝ち' },
            { id: 'waf2025-MM90-R-L3-2', round: 'L', no: 3, slot: 2, a: 'w48', b: 'w51', winner: 'w48', method: 'ピン勝ち' },
            { id: 'waf2025-MM90-R-L3-3', round: 'L', no: 3, slot: 3, a: 'w50', b: 'w47', winner: 'w47', method: 'ピン勝ち' },
            { id: 'waf2025-MM90-R-L3-4', round: 'L', no: 3, slot: 4, a: 'w49', b: 'w46', winner: 'w46', method: '2ファール勝ち' },
            // 敗者復活戦4回戦
            { id: 'waf2025-MM90-R-L4-1', round: 'L', no: 4, slot: 1, a: 'w45', b: 'w48', winner: 'w45', method: '2ファール勝ち', note: 'レフリーズグリップ' },
            // 敗者復活戦5回戦
            { id: 'waf2025-MM90-R-L5-1', round: 'L', no: 5, slot: 1, a: 'w47', b: 'w45', winner: 'w45', method: 'ピン勝ち' },
            // 敗者復活戦6回戦
            { id: 'waf2025-MM90-R-L6-1', round: 'L', no: 6, slot: 1, a: 'w46', b: 'w45', winner: 'w45', method: '2ファール勝ち', note: 'ストラップ' },
            // 敗者復活戦決勝
            { id: 'waf2025-MM90-R-LF', round: 'LF', no: 0, slot: 1, a: 'w44', b: 'w45', winner: 'w44', method: 'ピン勝ち', note: '右腕級の終盤（画面にセミファイナルの表示あり）。' },
            // 決勝
            { id: 'waf2025-MM90-R-F', round: 'F', no: 0, slot: 1, a: 'w43', b: 'w44', winner: 'w43', method: 'ピン勝ち' },
          ],
        },
        {
          // 出典: WAF2025_マスターズ90kg左右.xlsx
          classId: 'MM90', arm: 'L', format: 'double',
          entries: ['w43', 'w61', 'w47', 'w50', 'w46', 'w55', 'w62', 'w56', 'w44', 'w54', 'w59', 'w63', 'w52', 'w53', 'w51', 'w58', 'w57'],
          matches: [
            // 本戦1回戦
            { id: 'waf2025-MM90-L-W1-1', round: 'W', no: 1, slot: 1, a: 'w46', b: 'w61', winner: 'w61', method: '2ファール勝ち' },
            { id: 'waf2025-MM90-L-W1-2', round: 'W', no: 1, slot: 2, a: 'w44', b: 'w57', winner: 'w44', method: '不戦勝' },
            { id: 'waf2025-MM90-L-W1-3', round: 'W', no: 1, slot: 3, a: 'w56', b: 'w58', winner: 'w56', method: 'ピン勝ち', note: 'ストラップ' },
            { id: 'waf2025-MM90-L-W1-4', round: 'W', no: 1, slot: 4, a: 'w59', b: 'w47', winner: 'w47', method: 'ピン勝ち' },
            { id: 'waf2025-MM90-L-W1-5', round: 'W', no: 1, slot: 5, a: 'w62', b: 'w63', winner: 'w63', method: '不戦勝' },
            { id: 'waf2025-MM90-L-W1-6', round: 'W', no: 1, slot: 6, a: 'w51', b: 'w43', winner: 'w43', method: 'ピン勝ち', note: 'レフリーズグリップ' },
            { id: 'waf2025-MM90-L-W1-7', round: 'W', no: 1, slot: 7, a: 'w55', b: 'w54', winner: 'w55', method: 'ピン勝ち', note: 'ストラップ' },
            { id: 'waf2025-MM90-L-W1-8', round: 'W', no: 1, slot: 8, a: 'w53', b: 'w50', winner: 'w50', method: 'ピン勝ち' },
            // 本戦2回戦
            { id: 'waf2025-MM90-L-W2-1', round: 'W', no: 2, slot: 1, a: 'w52', b: 'w61', winner: 'w61', method: 'ピン勝ち' },
            { id: 'waf2025-MM90-L-W2-2', round: 'W', no: 2, slot: 2, a: 'w44', b: 'w56', winner: 'w44', method: 'ピン勝ち' },
            { id: 'waf2025-MM90-L-W2-3', round: 'W', no: 2, slot: 3, a: 'w47', b: 'w63', winner: 'w47', method: 'ピン勝ち' },
            { id: 'waf2025-MM90-L-W2-4', round: 'W', no: 2, slot: 4, a: 'w43', b: 'w55', winner: 'w43', method: 'ピン勝ち' },
            // 本戦3回戦
            { id: 'waf2025-MM90-L-W3-1', round: 'W', no: 3, slot: 1, a: 'w50', b: 'w61', winner: 'w61', method: 'ピン勝ち', note: 'ストラップ' },
            { id: 'waf2025-MM90-L-W3-2', round: 'W', no: 3, slot: 2, a: 'w44', b: 'w47', winner: 'w47', method: 'ピン勝ち', note: 'ストラップ' },
            // 本戦4回戦
            { id: 'waf2025-MM90-L-W4-1', round: 'W', no: 4, slot: 1, a: 'w43', b: 'w61', winner: 'w43', method: 'ピン勝ち' },
            // 本戦決勝
            { id: 'waf2025-MM90-L-WF', round: 'WF', no: 0, slot: 1, a: 'w47', b: 'w43', winner: 'w43', method: 'ピン勝ち' },
            // 敗者復活戦1回戦
            { id: 'waf2025-MM90-L-L1-1', round: 'L', no: 1, slot: 1, a: 'w46', b: 'w57', winner: 'w46', method: '不戦勝' },
            { id: 'waf2025-MM90-L-L1-2', round: 'L', no: 1, slot: 2, a: 'w58', b: 'w59', winner: 'w59', method: 'ピン勝ち', note: 'ストラップ' },
            { id: 'waf2025-MM90-L-L1-3', round: 'L', no: 1, slot: 3, a: 'w62', b: 'w51', winner: 'w62', method: '2ファール勝ち', note: 'レフリーズグリップ、ストラップ' },
            { id: 'waf2025-MM90-L-L1-4', round: 'L', no: 1, slot: 4, a: 'w54', b: 'w53', winner: 'w54', method: '2ファール勝ち' },
            // 敗者復活戦2回戦
            { id: 'waf2025-MM90-L-L2-1', round: 'L', no: 2, slot: 1, a: 'w52', b: 'w56', winner: 'w56', method: 'ピン勝ち', note: 'レフリーズグリップ' },
            { id: 'waf2025-MM90-L-L2-2', round: 'L', no: 2, slot: 2, a: 'w63', b: 'w55', winner: 'w55', method: 'ピン勝ち' },
            { id: 'waf2025-MM90-L-L2-3', round: 'L', no: 2, slot: 3, a: 'w46', b: 'w59', winner: 'w46', method: 'ピン勝ち', note: 'ストラップ' },
            { id: 'waf2025-MM90-L-L2-4', round: 'L', no: 2, slot: 4, a: 'w62', b: 'w54', winner: 'w62', method: 'ウィナーズポジション', note: '勝ち方は要確認（Excelの記載のまま）' },
            // 敗者復活戦3回戦
            { id: 'waf2025-MM90-L-L3-1', round: 'L', no: 3, slot: 1, a: 'w50', b: 'w44', winner: 'w50', method: 'ピン勝ち' },
            { id: 'waf2025-MM90-L-L3-2', round: 'L', no: 3, slot: 2, a: 'w56', b: 'w55', winner: 'w55', method: 'ピン勝ち' },
            { id: 'waf2025-MM90-L-L3-3', round: 'L', no: 3, slot: 3, a: 'w46', b: 'w62', winner: 'w46', method: 'ピン勝ち', note: 'ストラップ' },
            // 敗者復活戦4回戦
            { id: 'waf2025-MM90-L-L4-1', round: 'L', no: 4, slot: 1, a: 'w61', b: 'w55', winner: 'w61', method: 'ピン勝ち' },
            { id: 'waf2025-MM90-L-L4-2', round: 'L', no: 4, slot: 2, a: 'w50', b: 'w46', winner: 'w50', method: 'ピン勝ち', note: 'ストラップ' },
            // 敗者復活戦5回戦
            { id: 'waf2025-MM90-L-L5-1', round: 'L', no: 5, slot: 1, a: 'w61', b: 'w50', winner: 'w61', method: 'ピン勝ち', note: 'ストラップ' },
            // 敗者復活戦決勝
            { id: 'waf2025-MM90-L-LF', round: 'LF', no: 0, slot: 1, a: 'w47', b: 'w61', winner: 'w61', method: 'ピン勝ち', note: 'ストラップ' },
            // 決勝
            { id: 'waf2025-MM90-L-F', round: 'F', no: 0, slot: 1, a: 'w43', b: 'w61', winner: 'w43', method: 'ピン勝ち', note: 'レフリーズグリップ' },
          ],
        },
      ],
    },
    {
      id: 'aj24', organizer: 'AJAF', name: '第24回オールジャパンアームレスリング選手権大会', short: '第24回オールジャパン', date: '2026-05-04',
      venue: '神奈川県・ひらしん平塚文化芸術ホール 大ホール', level: '全国大会',
      weighIns: {},
      divisions: [
        {
          // 出典: 第24回オールジャパンアームレスリング選手権大会_石島サップデータ.xlsx「大会詳細」シート
          // 石島 サップさんの出場試合のみ（試合詳細の fouls / warnings は [a, b]）
          classId: 'MM80', arm: 'L', format: 'double', incomplete: true,
          note: '石島 サップさんの出場試合のみ登録しています。ほかの試合と出場者は未登録です。',
          entries: ['p05', 'p08', 'w29', 'p09'],
          matches: [
            { id: 'aj24-MM80-L-W1-1', round: 'W', no: 1, slot: 1, a: 'p05', b: 'p08', winner: 'p05', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: '石島 サップさんがスピードとパワーで勝ちました。親指を落とす攻めでした。' } },
            { id: 'aj24-MM80-L-W2-1', round: 'W', no: 2, slot: 1, a: 'p05', b: 'w29', winner: 'p05', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: '石島 サップさんがスピードとパワーで勝ちました。親指を落とす攻めでした。' } },
            { id: 'aj24-MM80-L-WF', round: 'WF', no: 0, slot: 1, a: 'p05', b: 'p09', winner: 'p05', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: '石島 サップさんがスピードとパワーで勝ちました。' } },
            { id: 'aj24-MM80-L-F', round: 'F', no: 0, slot: 1, a: 'p05', b: 'p09', winner: 'p09', method: '2ファール勝ち',
              detail: { fouls: [2, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: '東口 宜弘さんは、親指を落とされないように序盤から攻めていました。石島 サップさんの2ファール負けですが、東口 宜弘さんが終始攻めていました。' } },
            { id: 'aj24-MM80-L-F2', round: 'F2', no: 0, slot: 1, a: 'p09', b: 'p05', winner: 'p05', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 1], strapRequest: 'なし', strap: 'あり', refereeGrip: 'なし', remark: '1回目は東口 宜弘さんが攻めていましたが、ストラップになると石島 サップさんが攻め方を変えて勝ちました。' } },
          ],
        },
      ],
    },
    {
      id: 'mg5', organizer: 'JAWA', name: '第5回 MUSCLE GATE マッスルゲート アームレスリングトーナメント', short: '第5回 MUSCLE GATE', date: '2025-02-16',
      venue: '神奈川県・カルッツかわさき', level: 'オープン大会',
      weighIns: {},
      divisions: [
        {
          // 出典: 第5回 MUSCLE GATE マッスルゲート アームレスリングトーナメント_石島サップデータ.xlsx「大会詳細」シート
          // 石島 サップさんの出場試合のみ（試合詳細の fouls / warnings は [a, b]）
          classId: 'OPEN', arm: 'L', format: 'double', incomplete: true,
          note: '石島 サップさんの出場試合のみ登録しています。ほかの試合と出場者は未登録です。',
          entries: ['p05', 'p06', 'w58', 'p07', 'p01'],
          matches: [
            { id: 'mg5-OPEN-L-W1-1', round: 'W', no: 1, slot: 1, a: 'p05', b: 'p06', winner: 'p05', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: '石島 サップさんがスピードとパワーで勝ちました。親指を落とす攻めでした。' } },
            { id: 'mg5-OPEN-L-W2-1', round: 'W', no: 2, slot: 1, a: 'p05', b: 'w58', winner: 'p05', method: 'ピン勝ち',
              detail: { fouls: [0, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: '石島 サップさんがスピードとパワーで勝ちました。親指を落とす攻めでした。' } },
            { id: 'mg5-OPEN-L-W3-1', round: 'W', no: 3, slot: 1, a: 'p07', b: 'p05', winner: 'p05', method: 'ピン勝ち',
              detail: { fouls: [0, 1], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: '石島 サップさんがスピードとパワーで勝ちました。1回目は親指を落とす攻め、2回目は手首を返す攻めでした。' } },
            { id: 'mg5-OPEN-L-WF', round: 'WF', no: 0, slot: 1, a: 'p05', b: 'p01', winner: 'p05', method: 'ピン勝ち',
              detail: { fouls: [1, 0], warnings: [0, 0], strapRequest: 'なし', strap: 'なし', refereeGrip: 'なし', remark: '石島 サップさんがスピードとパワーで勝ちました。' } },
            { id: 'mg5-OPEN-L-F', round: 'F', no: 0, slot: 1, a: 'p05', b: 'p07', winner: 'p05', method: 'ピン勝ち',
              detail: { fouls: [1, 1], warnings: [0, 0], strapRequest: 'なし', strap: 'あり', refereeGrip: 'なし', remark: '石島 サップさんにとっては遊びのような試合でした。耐えてからプレスし、最後は手首を攻めて勝ちました。スピードは使っていません。' } },
          ],
        },
      ],
    },
    {
      id: 'jo32', organizer: 'JAF', name: '第32回ジャパンオープンアームレスリング選手権大会', short: '第32回ジャパンオープン', date: '2026-01-11',
      venue: '宮城県・エルパーク仙台 ギャラリーホール', level: '全国大会（アジア選手権 日本代表選考会）',
      weighIns: {},
      divisions: [
        {
          classId: 'SM80', arm: 'L', format: 'double', entries: ['p02', 'p01', 'p03', 'p04'],
          matches: [
            { id: 'jo32-SM80-L-W1-1', round: 'W', no: 1, slot: 1, a: 'p02', b: 'p01', winner: 'p01', method: 'ピン勝ち' },
            { id: 'jo32-SM80-L-W1-2', round: 'W', no: 1, slot: 2, a: 'p03', b: 'p04', winner: 'p03', method: 'ピン勝ち' },
            { id: 'jo32-SM80-L-WF', round: 'WF', no: 0, slot: 1, a: 'p01', b: 'p03', winner: 'p03', method: 'ピン勝ち' },
            { id: 'jo32-SM80-L-L1-1', round: 'L', no: 1, slot: 1, a: 'p02', b: 'p04', winner: 'p02', method: 'ピン勝ち' },
            { id: 'jo32-SM80-L-LF', round: 'LF', no: 0, slot: 1, a: 'p02', b: 'p01', winner: 'p01', method: 'ピン勝ち' },
            { id: 'jo32-SM80-L-F', round: 'F', no: 0, slot: 1, a: 'p03', b: 'p01', winner: 'p03', method: 'ピン勝ち' },
          ],
        },
        {
          // 川上選手は欠場（×）のため、該当の試合は不戦として除外
          classId: 'SM80', arm: 'R', format: 'double', entries: ['p04', 'p02', 'p03', 'p01'],
          matches: [
            { id: 'jo32-SM80-R-W1-1', round: 'W', no: 1, slot: 1, a: 'p04', b: 'p02', winner: 'p02', method: 'ピン勝ち' },
            { id: 'jo32-SM80-R-W1-2', round: 'W', no: 1, slot: 2, a: 'p03', b: 'p01', winner: 'p03', method: 'ピン勝ち' },
            { id: 'jo32-SM80-R-WF', round: 'WF', no: 0, slot: 1, a: 'p02', b: 'p03', winner: 'p03', method: 'ピン勝ち' },
            { id: 'jo32-SM80-R-L1-1', round: 'L', no: 1, slot: 1, a: 'p01', b: 'p04', winner: 'p01', method: 'ピン勝ち' },
            { id: 'jo32-SM80-R-LF', round: 'LF', no: 0, slot: 1, a: 'p01', b: 'p02', winner: 'p02', method: 'ピン勝ち' },
            { id: 'jo32-SM80-R-F', round: 'F', no: 0, slot: 1, a: 'p03', b: 'p02', winner: 'p03', method: 'ピン勝ち' },
          ],
        },
      ],
    },

    // ---- サンプルデータ（架空） ----
    {
      id: 't1', sample: true, organizer: 'JAWA', name: '2026 東日本アームレスリング選手権', short: '東日本選手権', date: '2026-04-19',
      venue: '東京都・墨田区総合体育館', level: '地方大会',
      weighIns: {
        a01: 69.2, a02: 68.5, a03: 69.7, a04: 67.1, a05: 68.9, a06: 66.4, a07: 69.5, a08: 68.0, a09: 67.6, a10: 69.8,
        a11: 79.6, a12: 78.2, a13: 79.1, a14: 76.8, a15: 78.9, a16: 77.4, a17: 79.8, a18: 75.9, a19: 78.4, a20: 79.3, a21: 77.0, a22: 76.2,
        a23: 59.4, a24: 58.7, a25: 59.8, a26: 57.2, a27: 58.1, a28: 59.0, a29: 56.4, a30: 58.8,
      },
      divisions: [
        { classId: 'M70', arm: 'R', format: 'double', entries: ['a01', 'a02', 'a03', 'a07', 'a05', 'a10', 'a06', 'a09'] },
        { classId: 'M70', arm: 'L', format: 'double', entries: ['a08', 'a01', 'a04', 'a02', 'a06', 'a05', 'a10', 'a09'] },
        { classId: 'M80', arm: 'R', format: 'double', entries: ['a11', 'a12', 'a13', 'a15', 'a14', 'a17', 'a16', 'a18'] },
        { classId: 'M80', arm: 'L', format: 'double', entries: ['a19', 'a11', 'a13', 'a20', 'a17', 'a15', 'a21', 'a22'] },
        { classId: 'W60', arm: 'R', format: 'league', final: true, entries: ['a23', 'a24', 'a27', 'a25', 'a26'] },
        { classId: 'W60', arm: 'L', format: 'league', final: true, entries: ['a25', 'a23', 'a28', 'a30', 'a29'] },
      ],
    },
    {
      id: 't2', sample: true, organizer: 'AJAF', name: '2026 全日本アームレスリング選手権', short: '全日本選手権', date: '2026-07-12',
      venue: '大阪府・エディオンアリーナ大阪', level: '全国大会',
      weighIns: {
        a01: 68.7, a02: 69.1, a03: 69.4, a04: 67.8, a05: 69.3, a06: 67.0, a07: 69.9, a08: 68.4, a09: 68.2,
        a11: 79.2, a12: 78.8, a13: 79.5, a14: 77.3, a15: 78.1, a16: 77.9, a17: 79.6, a18: 76.4, a19: 78.9, a20: 79.0, a21: 77.6, a22: 75.8,
        a23: 59.1, a24: 59.3, a25: 59.6, a26: 57.9, a27: 58.5, a28: 58.6, a29: 57.0, a30: 59.2,
        a31: 69.4, a32: 68.8,
      },
      divisions: [
        { classId: 'M70', arm: 'R', format: 'double', entries: ['a02', 'a01', 'a03', 'a07', 'a05', 'a06', 'a09', 'a31'] },
        { classId: 'M70', arm: 'L', format: 'double', entries: ['a01', 'a08', 'a04', 'a02', 'a06', 'a05', 'a09', 'a32'] },
        { classId: 'M80', arm: 'R', format: 'double', entries: ['a11', 'a12', 'a13', 'a15', 'a14', 'a17', 'a19', 'a16', 'a20', 'a18', 'a31'] },
        { classId: 'M80', arm: 'L', format: 'double', entries: ['a19', 'a11', 'a13', 'a20', 'a17', 'a15', 'a21', 'a22', 'a32'] },
        { classId: 'W60', arm: 'R', format: 'league', final: true, entries: ['a24', 'a23', 'a27', 'a25', 'a26', 'a29'] },
        { classId: 'W60', arm: 'L', format: 'league', final: true, entries: ['a25', 'a23', 'a28', 'a29', 'a30'] },
      ],
    },
    {
      id: 't3', sample: true, organizer: '日本腕相撲協会', name: '2026 秋季アームレスリングオープン', short: '秋季オープン', date: '2026-09-27',
      venue: '愛知県・名古屋市総合体育館', level: 'オープン大会',
      weighIns: {
        a01: 69.5, a02: 68.9, a03: 69.8, a04: 68.3, a05: 68.6, a06: 67.4, a07: 69.6, a08: 68.9, a09: 68.8,
        a10: 73.6, a11: 79.4, a12: 78.5, a13: 79.0, a14: 77.8, a15: 78.6, a17: 79.9, a18: 76.7, a19: 79.1, a20: 79.4, a21: 78.0,
        a23: 59.6, a24: 58.9, a25: 59.9, a26: 58.3, a27: 58.0, a28: 59.3, a29: 57.5, a30: 59.0,
        a31: 69.7, a32: 69.2,
      },
      divisions: [
        { classId: 'M70', arm: 'R', format: 'double', entries: ['a01', 'a02', 'a07', 'a03', 'a05', 'a06', 'a09', 'a31'] },
        { classId: 'M70', arm: 'L', format: 'double', entries: ['a08', 'a01', 'a04', 'a06', 'a02', 'a05', 'a09', 'a32'] },
        { classId: 'M80', arm: 'R', format: 'double', entries: ['a11', 'a13', 'a12', 'a15', 'a14', 'a17', 'a10', 'a18', 'a31'] },
        { classId: 'M80', arm: 'L', format: 'double', entries: ['a19', 'a11', 'a13', 'a20', 'a15', 'a17', 'a21', 'a10', 'a32'] },
        { classId: 'W60', arm: 'R', format: 'league', final: true, entries: ['a23', 'a24', 'a27', 'a26', 'a25'] },
        { classId: 'W60', arm: 'L', format: 'league', final: true, entries: ['a25', 'a23', 'a28', 'a29', 'a30'] },
      ],
    },
  ],

  // 試合詳細（自動生成された試合など、matches に直接書けない試合用）{ 試合ID: detail }
  // fouls / warnings は { 選手ID: 数 } でも指定できます
  details: {
    // 仮データ: 秋季オープン 男子 -70kg 右腕 決勝1回目
    't3-M70-R-F': {
      fouls: { a01: 1, a02: 0 },    // 佐藤 剛 1、鈴木 拓海 0
      warnings: { a01: 3, a02: 1 }, // 佐藤 剛 3、鈴木 拓海 1
      strapRequest: 'なし',
      strap: 'あり',
      refereeGrip: 'なし',
      remark: '佐藤剛さんのアーリースタートが目立つ試合でした。',
    },
  },

  videos: {
    // 2024 WAF世界選手権 マスターズ男子 -80kg 左腕・右腕（「入力データ」シートの時刻を秒に換算）
    'waf2024-MM80-L-W1-1': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 154, end: 445 }, // No.1 0:02:34〜0:07:25
    'waf2024-MM80-L-W1-2': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 447, end: 605 }, // No.2 0:07:27〜0:10:05
    'waf2024-MM80-L-W1-3': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 607, end: 714 }, // No.3 0:10:07〜0:11:54
    'waf2024-MM80-L-W1-4': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 719, end: 796 }, // No.4 0:11:59〜0:13:16
    'waf2024-MM80-L-W1-5': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 798, end: 966 }, // No.5 0:13:18〜0:16:06
    'waf2024-MM80-L-W2-1': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 971, end: 1323 }, // No.6 0:16:11〜0:22:03
    'waf2024-MM80-L-W2-2': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 1328, end: 1384 }, // No.7 0:22:08〜0:23:04
    'waf2024-MM80-L-W3-1': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 1736, end: 2210 }, // No.10 0:28:56〜0:36:50
    'waf2024-MM80-L-WF': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 2910, end: 3068 }, // No.15 0:48:30〜0:51:08
    'waf2024-MM80-L-L1-1': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 1389, end: 1598 }, // No.8 0:23:09〜0:26:38
    'waf2024-MM80-L-L1-2': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 1603, end: 1731 }, // No.9 0:26:43〜0:28:51
    'waf2024-MM80-L-L2-1': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 2212, end: 2441 }, // No.11 0:36:52〜0:40:41
    'waf2024-MM80-L-L2-2': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 2446, end: 2645 }, // No.12 0:40:46〜0:44:05
    'waf2024-MM80-L-L3-1': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 2647, end: 2754 }, // No.13 0:44:07〜0:45:54
    'waf2024-MM80-L-L3-2': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 2760, end: 2907 }, // No.14 0:46:00〜0:48:27
    'waf2024-MM80-L-L4-1': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 3073, end: 3577 }, // No.16 0:51:13〜0:59:37
    'waf2024-MM80-L-LF': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 3579, end: 3914 }, // No.17 0:59:39〜1:05:14
    'waf2024-MM80-L-F': { url: 'https://www.youtube.com/watch?v=HVivR0fnPgw', start: 1964, end: 2233 }, // No.18 0:32:44〜0:37:13
    'waf2024-MM80-R-W1-1': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 8152, end: 8381 }, // No.19 2:15:52〜2:19:41
    'waf2024-MM80-R-W1-2': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 8386, end: 8575 }, // No.20 2:19:46〜2:22:55
    'waf2024-MM80-R-W1-3': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 8580, end: 8860 }, // No.21 2:23:00〜2:27:40
    'waf2024-MM80-R-W1-4': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 8862, end: 9122 }, // No.22 2:27:42〜2:32:02
    'waf2024-MM80-R-W1-5': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 9124, end: 9242 }, // No.23 2:32:04〜2:34:02
    'waf2024-MM80-R-W1-6': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 9247, end: 9385 }, // No.24 2:34:07〜2:36:25
    'waf2024-MM80-R-W2-1': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 9390, end: 9548 }, // No.25 2:36:30〜2:39:08
    'waf2024-MM80-R-W2-2': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 9553, end: 9711 }, // No.26 2:39:13〜2:41:51
    'waf2024-MM80-R-W2-3': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 9716, end: 9884 }, // No.27 2:41:56〜2:44:44
    'waf2024-MM80-R-W3-1': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 10486, end: 10838 }, // No.31 2:54:46〜3:00:38
    'waf2024-MM80-R-WF': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 11533, end: 11773 }, // No.37 3:12:13〜3:16:13
    'waf2024-MM80-R-L1-1': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 9887, end: 10239 }, // No.28 2:44:47〜2:50:39
    'waf2024-MM80-R-L1-2': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 10241, end: 10317 }, // No.29 2:50:41〜2:51:57
    'waf2024-MM80-R-L1-3': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 10322, end: 10481 }, // No.30 2:52:02〜2:54:41
    'waf2024-MM80-R-L2-1': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 10843, end: 10930 }, // No.32 3:00:43〜3:02:10
    'waf2024-MM80-R-L2-2': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 10932, end: 11223 }, // No.33 3:02:12〜3:07:03
    'waf2024-MM80-R-L2-3': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 11225, end: 11302 }, // No.34 3:07:05〜3:08:22
    'waf2024-MM80-R-L3-1': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 11304, end: 11421 }, // No.35 3:08:24〜3:10:21
    'waf2024-MM80-R-L3-2': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 11424, end: 11531 }, // No.36 3:10:24〜3:12:11
    'waf2024-MM80-R-L4-1': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 11775, end: 11944 }, // No.38 3:16:15〜3:19:04
    'waf2024-MM80-R-LF': { url: 'https://www.youtube.com/watch?v=_WjaUjnHn2s', start: 11946, end: 12403 }, // No.39 3:19:06〜3:26:43
    'waf2024-MM80-R-F': { url: 'https://www.youtube.com/watch?v=HVivR0fnPgw', start: 9908, end: 10276 }, // No.40 2:45:08〜2:51:16
    // 第32回ジャパンオープン シニア -80kg（start〜end 秒の範囲だけ再生）
    // 左腕
    'jo32-SM80-L-W1-1': { url: 'https://youtu.be/erxZ_ZOBl-U', start: 5528, end: 5623 }, // 1:32:08〜1:33:43
    'jo32-SM80-L-W1-2': { url: 'https://youtu.be/erxZ_ZOBl-U', start: 5640, end: 5747 }, // 1:34:00〜1:35:47
    'jo32-SM80-L-WF': { url: 'https://youtu.be/erxZ_ZOBl-U', start: 5760, end: 5864 }, // 1:36:00〜1:37:44
    'jo32-SM80-L-L1-1': { url: 'https://youtu.be/36AsXpQAT8Y', start: 665, end: 768 }, // 0:11:05〜0:12:48
    'jo32-SM80-L-LF': { url: 'https://youtu.be/36AsXpQAT8Y', start: 780, end: 865 }, // 0:13:00〜0:14:25
    'jo32-SM80-L-F': { url: 'https://youtu.be/_tn-xLkqvlE', start: 3090, end: 3160 }, // 0:51:30〜0:52:40
    // 右腕
    'jo32-SM80-R-W1-1': { url: 'https://youtu.be/erxZ_ZOBl-U', start: 5956, end: 6060 }, // 1:39:16〜1:41:00
    'jo32-SM80-R-W1-2': { url: 'https://youtu.be/erxZ_ZOBl-U', start: 6080, end: 6206 }, // 1:41:20〜1:43:26
    'jo32-SM80-R-WF': { url: 'https://youtu.be/erxZ_ZOBl-U', start: 6290, end: 6451 }, // 1:44:50〜1:47:31
    'jo32-SM80-R-L1-1': { url: 'https://youtu.be/36AsXpQAT8Y', start: 345, end: 431 }, // 0:05:45〜0:07:11
    'jo32-SM80-R-LF': { url: 'https://youtu.be/36AsXpQAT8Y', start: 508, end: 616 }, // 0:08:28〜0:10:16
    'jo32-SM80-R-F': { url: 'https://youtu.be/_tn-xLkqvlE', start: 3175, end: 3296 }, // 0:52:55〜0:54:56
    // 第5回 MUSCLE GATE 無差別級 左腕（「大会詳細」シートの時刻を秒に換算）
    'mg5-OPEN-L-W1-1': { url: 'https://youtu.be/EhZFQ8rWrDo', start: 62, end: 95 }, // 0:01:02〜0:01:35
    'mg5-OPEN-L-W2-1': { url: 'https://youtu.be/EhZFQ8rWrDo', start: 277, end: 307 }, // 0:04:37〜0:05:07
    'mg5-OPEN-L-W3-1': { url: 'https://youtu.be/EhZFQ8rWrDo', start: 488, end: 550 }, // 0:08:08〜0:09:10
    'mg5-OPEN-L-WF': { url: 'https://youtu.be/EhZFQ8rWrDo', start: 615, end: 678 }, // 0:10:15〜0:11:18
    'mg5-OPEN-L-F': { url: 'https://www.youtube.com/watch?v=APKEhzA2DDU', start: 540, end: 837 }, // 0:09:00〜0:13:57
    // 第24回オールジャパン マスターズ男子 -80kg 左腕（「大会詳細」シートの時刻を秒に換算）
    'aj24-MM80-L-W1-1': { url: 'https://www.youtube.com/watch?v=s3lOfSa0u5w', start: 170, end: 176 }, // 0:02:50〜0:02:56
    'aj24-MM80-L-W2-1': { url: 'https://www.youtube.com/watch?v=s3lOfSa0u5w', start: 475, end: 479 }, // 0:07:55〜0:07:59
    'aj24-MM80-L-WF': { url: 'https://www.youtube.com/watch?v=s3lOfSa0u5w', start: 660, end: 664 }, // 0:11:00〜0:11:04
    'aj24-MM80-L-F': { url: 'https://www.youtube.com/watch?v=j24-P6s4uxY', start: 2593, end: 2776 }, // 0:43:13〜0:46:16
    'aj24-MM80-L-F2': { url: 'https://www.youtube.com/watch?v=j24-P6s4uxY', start: 2796, end: 2946 }, // 0:46:36〜0:49:06
    // 2025 WAF世界選手権 マスターズ男子 -80kg 左腕（Excel D列〜E列の時刻を秒に換算）
    'waf2025-MM80-L-W1-1': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 255, end: 350 }, // No.2 0:04:15〜0:05:50
    'waf2025-MM80-L-W1-2': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 381, end: 455 }, // No.3 0:06:21〜0:07:35
    'waf2025-MM80-L-W1-3': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 485, end: 646 }, // No.4 0:08:05〜0:10:46
    'waf2025-MM80-L-W1-4': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 677, end: 850 }, // No.5 0:11:17〜0:14:10
    'waf2025-MM80-L-W1-5': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 878, end: 964 }, // No.6 0:14:38〜0:16:04
    'waf2025-MM80-L-W1-6': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 981, end: 1077 }, // No.7 0:16:21〜0:17:57
    'waf2025-MM80-L-W1-7': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 1108, end: 1236 }, // No.8 0:18:28〜0:20:36
    'waf2025-MM80-L-W1-8': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 1270, end: 1306 }, // No.9 0:21:10〜0:21:46
    'waf2025-MM80-L-W1-9': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 1340, end: 1436 }, // No.10 0:22:20〜0:23:56
    'waf2025-MM80-L-W2-1': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 1468, end: 1586 }, // No.11 0:24:28〜0:26:26
    'waf2025-MM80-L-W2-2': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 1601, end: 1690 }, // No.12 0:26:41〜0:28:10
    'waf2025-MM80-L-W2-3': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 1727, end: 1822 }, // No.13 0:28:47〜0:30:22
    'waf2025-MM80-L-W2-4': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 1856, end: 1945 }, // No.14 0:30:56〜0:32:25
    'waf2025-MM80-L-W2-5': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 1955, end: 2214 }, // No.15 0:32:35〜0:36:54
    'waf2025-MM80-L-W2-6': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 2246, end: 2470 }, // No.16 0:37:26〜0:41:10
    'waf2025-MM80-L-L1-1': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 2575, end: 2623 }, // No.18 0:42:55〜0:43:43
    'waf2025-MM80-L-L1-2': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 2642, end: 2740 }, // No.19 0:44:02〜0:45:40
    'waf2025-MM80-L-L1-3': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 2770, end: 3187 }, // No.20 0:46:10〜0:53:07
    'waf2025-MM80-L-L1-4': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 3219, end: 3285 }, // No.21 0:53:39〜0:54:45
    'waf2025-MM80-L-W3-1': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 3320, end: 3545 }, // No.22 0:55:20〜0:59:05
    'waf2025-MM80-L-W3-2': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 3555, end: 3635 }, // No.23 0:59:15〜1:00:35
    'waf2025-MM80-L-W3-3': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 3650, end: 4010 }, // No.24 1:00:50〜1:06:50
    'waf2025-MM80-L-L2-1': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 4038, end: 4243 }, // No.25 1:07:18〜1:10:43
    'waf2025-MM80-L-L2-2': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 4274, end: 4396 }, // No.26 1:11:14〜1:13:16
    'waf2025-MM80-L-L2-3': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 4436, end: 4576 }, // No.27 1:13:56〜1:16:16
    'waf2025-MM80-L-L2-4': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 4601, end: 4695 }, // No.28 1:16:41〜1:18:15
    'waf2025-MM80-L-L2-5': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 4726, end: 4916 }, // No.29 1:18:46〜1:21:56
    'waf2025-MM80-L-W4-1': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 4956, end: 5220 }, // No.30 1:22:36〜1:27:00
    'waf2025-MM80-L-L3-1': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 5255, end: 5386 }, // No.31 1:27:35〜1:29:46
    'waf2025-MM80-L-L3-2': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 5418, end: 5650 }, // No.32 1:30:18〜1:34:10
    'waf2025-MM80-L-L3-3': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 5680, end: 5792 }, // No.33 1:34:40〜1:36:32
    'waf2025-MM80-L-L3-4': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 5810, end: 6047 }, // No.34 1:36:50〜1:40:47
    'waf2025-MM80-L-L3-5': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 6080, end: 6175 }, // No.35 1:41:20〜1:42:55
    'waf2025-MM80-L-L4-1': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 6241, end: 6605 }, // No.36 1:44:01〜1:50:05
    'waf2025-MM80-L-L4-2': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 6640, end: 6675 }, // No.37 1:50:40〜1:51:15
    'waf2025-MM80-L-L5-1': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 6705, end: 6869 }, // No.38 1:51:45〜1:54:29
    'waf2025-MM80-L-WF': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 6900, end: 7110 }, // No.39 1:55:00〜1:58:30
    'waf2025-MM80-L-L6-1': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 7131, end: 7680 }, // No.40 1:58:51〜2:08:00
    'waf2025-MM80-L-LF': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 7710, end: 7830 }, // No.41 2:08:30〜2:10:30
    // 決勝（別動画。Excelの時刻は「時:分」で保存されていたため「分:秒」として換算）
    'waf2025-MM80-L-F': { url: 'https://www.youtube.com/watch?v=POuaCNJsUcY', start: 1304, end: 1484 }, // No.42 0:21:44〜0:24:44
    'waf2025-MM80-L-F2': { url: 'https://www.youtube.com/watch?v=POuaCNJsUcY', start: 1675, end: 1730 }, // No.43 0:27:55〜0:28:50
    // 2025 WAF世界選手権 マスターズ男子 -80kg 右腕（Excelの時刻を秒に換算）
    'waf2025-MM80-R-W1-1': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 8820, end: 8880 }, // No.1 2:27:00〜2:28:00
    'waf2025-MM80-R-W1-2': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 8910, end: 9090 }, // No.2 2:28:30〜2:31:30
    'waf2025-MM80-R-W1-3': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 9120, end: 9210 }, // No.3 2:32:00〜2:33:30
    'waf2025-MM80-R-W1-4': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 9240, end: 9330 }, // No.4 2:34:00〜2:35:30
    'waf2025-MM80-R-W1-5': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 9360, end: 9390 }, // No.5 2:36:00〜2:36:30
    'waf2025-MM80-R-W1-6': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 9420, end: 9540 }, // No.6 2:37:00〜2:39:00
    'waf2025-MM80-R-W1-7': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 9570, end: 9870 }, // No.7 2:39:30〜2:44:30
    'waf2025-MM80-R-W1-8': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 9900, end: 9990 }, // No.8 2:45:00〜2:46:30
    'waf2025-MM80-R-W1-9': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 10020, end: 10080 }, // No.9 2:47:00〜2:48:00
    'waf2025-MM80-R-W1-10': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 10110, end: 10170 }, // No.10 2:48:30〜2:49:30
    'waf2025-MM80-R-W1-11': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 10200, end: 10260 }, // No.11 2:50:00〜2:51:00
    'waf2025-MM80-R-W2-1': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 10290, end: 10350 }, // No.12 2:51:30〜2:52:30
    'waf2025-MM80-R-W2-2': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 10380, end: 10620 }, // No.13 2:53:00〜2:57:00
    'waf2025-MM80-R-W2-3': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 10650, end: 10860 }, // No.14 2:57:30〜3:01:00
    'waf2025-MM80-R-W2-4': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 10890, end: 11610 }, // No.15 3:01:30〜3:13:30
    'waf2025-MM80-R-W2-5': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 11640, end: 11730 }, // No.16 3:14:00〜3:15:30
    'waf2025-MM80-R-W2-6': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 11790, end: 11880 }, // No.17 3:16:30〜3:18:00
    'waf2025-MM80-R-L1-1': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 11940, end: 11970 }, // No.18 3:19:00〜3:19:30
    'waf2025-MM80-R-L1-2': { url: 'https://www.youtube.com/watch?v=bKebygn7H8s', start: 12000, end: 12240 }, // No.19 3:20:00〜3:24:00
    'waf2025-MM80-R-F': { url: 'https://www.youtube.com/watch?v=POuaCNJsUcY', start: 6597, end: 6780 }, // No.20 1:49:57〜1:53:00
    // 2025 WAF世界選手権 マスターズ男子 -90kg 左腕・右腕（Excelの時刻を秒に換算）
    'waf2025-MM90-L-W1-1': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 5120, end: 5326 }, // No.1 1:25:20〜1:28:46
    'waf2025-MM90-L-W1-2': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 5335, end: 5448 }, // No.2 1:28:55〜1:30:48
    'waf2025-MM90-L-W1-3': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 5460, end: 5619 }, // No.3 1:31:00〜1:33:39
    'waf2025-MM90-L-W1-4': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 5630, end: 5708 }, // No.4 1:33:50〜1:35:08
    'waf2025-MM90-L-W1-5': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 5720, end: 5810 }, // No.5 1:35:20〜1:36:50
    'waf2025-MM90-L-W1-6': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 5820, end: 6024 }, // No.6 1:37:00〜1:40:24
    'waf2025-MM90-L-W1-7': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 6035, end: 6300 }, // No.7 1:40:35〜1:45:00
    'waf2025-MM90-L-W1-8': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 6310, end: 6399 }, // No.8 1:45:10〜1:46:39
    'waf2025-MM90-L-W2-1': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 6410, end: 6583 }, // No.9 1:46:50〜1:49:43
    'waf2025-MM90-L-W2-2': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 6590, end: 6664 }, // No.10 1:49:50〜1:51:04
    'waf2025-MM90-L-W2-3': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 6670, end: 6753 }, // No.11 1:51:10〜1:52:33
    'waf2025-MM90-L-W2-4': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 6760, end: 6832 }, // No.12 1:52:40〜1:53:52
    'waf2025-MM90-L-W3-1': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 7510, end: 7781 }, // No.17 2:05:10〜2:09:41
    'waf2025-MM90-L-W3-2': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 7790, end: 7935 }, // No.18 2:09:50〜2:12:15
    'waf2025-MM90-L-W4-1': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 8605, end: 8675 }, // No.23 2:23:25〜2:24:35
    'waf2025-MM90-L-WF': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 9621, end: 9693 }, // No.29 2:40:21〜2:41:33
    'waf2025-MM90-L-L1-1': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 6840, end: 6922 }, // No.13 1:54:00〜1:55:22
    'waf2025-MM90-L-L1-2': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 6930, end: 7103 }, // No.14 1:55:30〜1:58:23
    'waf2025-MM90-L-L1-3': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 7110, end: 7368 }, // No.15 1:58:30〜2:02:48
    'waf2025-MM90-L-L1-4': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 7380, end: 7498 }, // No.16 2:03:00〜2:04:58
    'waf2025-MM90-L-L2-1': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 7945, end: 8241 }, // No.19 2:12:25〜2:17:21
    'waf2025-MM90-L-L2-2': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 8250, end: 8302 }, // No.20 2:17:30〜2:18:22
    'waf2025-MM90-L-L2-3': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 8310, end: 8476 }, // No.21 2:18:30〜2:21:16
    'waf2025-MM90-L-L2-4': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 8485, end: 8596 }, // No.22 2:21:25〜2:23:16
    'waf2025-MM90-L-L3-1': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 8680, end: 8815 }, // No.24 2:24:40〜2:26:55
    'waf2025-MM90-L-L3-2': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 8820, end: 8883 }, // No.25 2:27:00〜2:28:03
    'waf2025-MM90-L-L3-3': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 8895, end: 9159 }, // No.26 2:28:15〜2:32:39
    'waf2025-MM90-L-L4-1': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 9165, end: 9279 }, // No.27 2:32:45〜2:34:39
    'waf2025-MM90-L-L4-2': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 9285, end: 9614 }, // No.28 2:34:45〜2:40:14
    'waf2025-MM90-L-L5-1': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 9705, end: 9815 }, // No.30 2:41:45〜2:43:35
    'waf2025-MM90-L-LF': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 9825, end: 10019 }, // No.31 2:43:45〜2:46:59
    'waf2025-MM90-L-F': { url: 'https://www.youtube.com/watch?v=POuaCNJsUcY', start: 1488, end: 1630 }, // No.32 0:24:48〜0:27:10
    'waf2025-MM90-R-W1-1': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 14637, end: 14796 }, // No.33 4:03:57〜4:06:36
    'waf2025-MM90-R-W1-2': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 14805, end: 15148 }, // No.34 4:06:45〜4:12:28
    'waf2025-MM90-R-W1-3': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 15156, end: 15216 }, // No.35 4:12:36〜4:13:36
    'waf2025-MM90-R-W1-4': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 15225, end: 15307 }, // No.36 4:13:45〜4:15:07
    'waf2025-MM90-R-W1-5': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 15318, end: 15381 }, // No.37 4:15:18〜4:16:21
    'waf2025-MM90-R-W1-6': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 15384, end: 15453 }, // No.38 4:16:24〜4:17:33
    'waf2025-MM90-R-W1-7': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 15462, end: 15600 }, // No.39 4:17:42〜4:20:00
    'waf2025-MM90-R-W1-8': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 15609, end: 15786 }, // No.40 4:20:09〜4:23:06
    'waf2025-MM90-R-W1-9': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 15795, end: 15948 }, // No.41 4:23:15〜4:25:48
    'waf2025-MM90-R-W2-1': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 15948, end: 15959 }, // No.42 4:25:48〜4:25:59
    'waf2025-MM90-R-W2-2': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 15963, end: 15974 }, // No.43 4:26:03〜4:26:14
    'waf2025-MM90-R-W3-1': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 16548, end: 16689 }, // No.48 4:35:48〜4:38:09
    'waf2025-MM90-R-W3-2': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 16701, end: 16781 }, // No.49 4:38:21〜4:39:41
    'waf2025-MM90-R-W4-1': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 17365, end: 17661 }, // No.54 4:49:25〜4:54:21
    'waf2025-MM90-R-WF': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 18501, end: 18562 }, // No.61 5:08:21〜5:09:22
    'waf2025-MM90-R-L1-1': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 15984, end: 16209 }, // No.44 4:26:24〜4:30:09
    'waf2025-MM90-R-L1-2': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 16221, end: 16311 }, // No.45 4:30:21〜4:31:51
    'waf2025-MM90-R-L1-3': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 16323, end: 16423 }, // No.46 4:32:03〜4:33:43
    'waf2025-MM90-R-L1-4': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 16434, end: 16536 }, // No.47 4:33:54〜4:35:36
    'waf2025-MM90-R-L2-1': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 16788, end: 16982 }, // No.50 4:39:48〜4:43:02
    'waf2025-MM90-R-L2-2': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 16992, end: 17041 }, // No.51 4:43:12〜4:44:01
    'waf2025-MM90-R-L2-3': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 17052, end: 17173 }, // No.52 4:44:12〜4:46:13
    'waf2025-MM90-R-L2-4': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 17184, end: 17357 }, // No.53 4:46:24〜4:49:17
    'waf2025-MM90-R-L3-1': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 17670, end: 17801 }, // No.55 4:54:30〜4:56:41
    'waf2025-MM90-R-L3-2': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 17811, end: 17903 }, // No.56 4:56:51〜4:58:23
    'waf2025-MM90-R-L3-3': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 17910, end: 18022 }, // No.57 4:58:30〜5:00:22
    'waf2025-MM90-R-L3-4': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 18033, end: 18155 }, // No.58 5:00:33〜5:02:35
    'waf2025-MM90-R-L4-1': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 18168, end: 18370 }, // No.59 5:02:48〜5:06:10
    'waf2025-MM90-R-L5-1': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 18378, end: 18490 }, // No.60 5:06:18〜5:08:10
    'waf2025-MM90-R-L6-1': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 18570, end: 18876 }, // No.62 5:09:30〜5:14:36
    'waf2025-MM90-R-LF': { url: 'https://www.youtube.com/watch?v=4Ls3EWSGfLM', start: 18888, end: 19051 }, // No.63 5:14:48〜5:17:31
    'waf2025-MM90-R-F': { url: 'https://www.youtube.com/watch?v=POuaCNJsUcY', start: 7123, end: 7176 }, // No.64 1:58:43〜1:59:36
    // 2025 WAF世界選手権 マスターズ男子 -70kg 左腕・右腕（「本データ」シートの時刻を秒に換算）
    'waf2025-MM70-L-W1-1': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 2910, end: 2969 }, // 行2 0:48:30〜0:49:29
    'waf2025-MM70-L-W1-2': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 3030, end: 3220 }, // 行3 0:50:30〜0:53:40
    'waf2025-MM70-L-W1-3': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 3290, end: 3390 }, // 行4 0:54:50〜0:56:30
    'waf2025-MM70-L-W1-4': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 3465, end: 3584 }, // 行5 0:57:45〜0:59:44
    'waf2025-MM70-L-W1-5': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 3645, end: 3734 }, // 行6 1:00:45〜1:02:14
    'waf2025-MM70-L-W1-6': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 3810, end: 3910 }, // 行7 1:03:30〜1:05:10
    'waf2025-MM70-L-W1-7': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 3990, end: 4063 }, // 行8 1:06:30〜1:07:43
    'waf2025-MM70-L-W1-8': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 4125, end: 4456 }, // 行9 1:08:45〜1:14:16
    'waf2025-MM70-L-W2-1': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 4545, end: 4616 }, // 行10 1:15:45〜1:16:56
    'waf2025-MM70-L-W2-2': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 4705, end: 4736 }, // 行11 1:18:25〜1:18:56
    'waf2025-MM70-L-W2-3': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 4799, end: 4817 }, // 行12 1:19:59〜1:20:17
    'waf2025-MM70-L-W2-4': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 4870, end: 4953 }, // 行13 1:21:10〜1:22:33
    'waf2025-MM70-L-W3-1': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 5614, end: 5688 }, // 行18 1:33:34〜1:34:48
    'waf2025-MM70-L-W3-2': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 5739, end: 5770 }, // 行19 1:35:39〜1:36:10
    'waf2025-MM70-L-WF': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 6936, end: 7107 }, // 行28 1:55:36〜1:58:27
    'waf2025-MM70-L-L1-1': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 5025, end: 5097 }, // 行14 1:23:45〜1:24:57
    'waf2025-MM70-L-L1-2': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 5160, end: 5200 }, // 行15 1:26:00〜1:26:40
    'waf2025-MM70-L-L1-3': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 5280, end: 5429 }, // 行16 1:28:00〜1:30:29
    'waf2025-MM70-L-L1-4': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 5486, end: 5590 }, // 行17 1:31:26〜1:33:10
    'waf2025-MM70-L-L2-1': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 5823, end: 5885 }, // 行20 1:37:03〜1:38:05
    'waf2025-MM70-L-L2-2': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 5933, end: 6083 }, // 行21 1:38:53〜1:41:23
    'waf2025-MM70-L-L2-3': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 6119, end: 6159 }, // 行22 1:41:59〜1:42:39
    'waf2025-MM70-L-L2-4': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 6192, end: 6244 }, // 行23 1:43:12〜1:44:04
    'waf2025-MM70-L-L3-1': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 6284, end: 6428 }, // 行24 1:44:44〜1:47:08
    'waf2025-MM70-L-L3-2': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 6460, end: 6502 }, // 行25 1:47:40〜1:48:22
    'waf2025-MM70-L-L4-1': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 6547, end: 6734 }, // 行26 1:49:07〜1:52:14
    'waf2025-MM70-L-L4-2': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 6774, end: 6883 }, // 行27 1:52:54〜1:54:43
    'waf2025-MM70-L-L5-1': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 7153, end: 7331 }, // 行29 1:59:13〜2:02:11
    'waf2025-MM70-L-LF': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 7384, end: 7484 }, // 行30 2:03:04〜2:04:44
    'waf2025-MM70-L-F': { url: 'https://www.youtube.com/watch?v=POuaCNJsUcY', start: 1200, end: 1283 }, // 行31 0:20:00〜0:21:23
    'waf2025-MM70-R-W1-1': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 11005, end: 11143 }, // 行32 3:03:25〜3:05:43
    'waf2025-MM70-R-W1-2': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 11156, end: 11226 }, // 行33 3:05:56〜3:07:06
    'waf2025-MM70-R-W1-3': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 11250, end: 11320 }, // 行34 3:07:30〜3:08:40
    'waf2025-MM70-R-W1-4': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 11358, end: 11454 }, // 行35 3:09:18〜3:10:54
    'waf2025-MM70-R-W1-5': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 11482, end: 11564 }, // 行36 3:11:22〜3:12:44
    'waf2025-MM70-R-W1-6': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 11579, end: 11634 }, // 行37 3:12:59〜3:13:54
    'waf2025-MM70-R-W1-7': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 11654, end: 11787 }, // 行38 3:14:14〜3:16:27
    'waf2025-MM70-R-W1-8': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 11816, end: 11993 }, // 行39 3:16:56〜3:19:53
    'waf2025-MM70-R-W1-9': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 12048, end: 12145 }, // 行40 3:20:48〜3:22:25
    'waf2025-MM70-R-W2-1': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 12203, end: 12246 }, // 行41 3:23:23〜3:24:06
    'waf2025-MM70-R-W2-2': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 12261, end: 12276 }, // 行42 3:24:21〜3:24:36
    'waf2025-MM70-R-W2-3': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 12285, end: 12361 }, // 行43 3:24:45〜3:26:01
    'waf2025-MM70-R-W3-1': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 12852, end: 12882 }, // 行48 3:34:12〜3:34:42
    'waf2025-MM70-R-W3-2': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 12924, end: 13009 }, // 行49 3:35:24〜3:36:49
    'waf2025-MM70-R-W4-1': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 13405, end: 13465 }, // 行54 3:43:25〜3:44:25
    'waf2025-MM70-R-WF': { url: 'https://www.youtube.com/watch?v=POuaCNJsUcY', start: 6199 }, // 行60 1:43:19〜（終了未設定）
    'waf2025-MM70-R-L1-1': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 12364, end: 12389 }, // 行44 3:26:04〜3:26:29
    'waf2025-MM70-R-L1-2': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 12397, end: 12564 }, // 行45 3:26:37〜3:29:24
    'waf2025-MM70-R-L1-3': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 12603, end: 12727 }, // 行46 3:30:03〜3:32:07
    'waf2025-MM70-R-L1-4': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 12752, end: 12821 }, // 行47 3:32:32〜3:33:41
    'waf2025-MM70-R-L2-1': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 13033, end: 13082 }, // 行50 3:37:13〜3:38:02
    'waf2025-MM70-R-L2-2': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 13101, end: 13159 }, // 行51 3:38:21〜3:39:19
    'waf2025-MM70-R-L2-3': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 13177, end: 13287 }, // 行52 3:39:37〜3:41:27
    'waf2025-MM70-R-L2-4': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 13304, end: 13356 }, // 行53 3:41:44〜3:42:36
    'waf2025-MM70-R-L2-5': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 13501, end: 13626 }, // 行55 3:45:01〜3:47:06
    'waf2025-MM70-R-L3-1': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 13651, end: 13850 }, // 行56 3:47:31〜3:50:50
    'waf2025-MM70-R-L3-2': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 13883, end: 13919 }, // 行57 3:51:23〜3:51:59
    'waf2025-MM70-R-L5-1': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 13925, end: 13946 }, // 行58 3:52:05〜3:52:26
    'waf2025-MM70-R-L6-1': { url: 'https://www.youtube.com/watch?v=M3hHPCuQz1c', start: 13950, end: 13967 }, // 行59 3:52:30〜3:52:47
    'waf2025-MM70-R-F': { url: 'https://www.youtube.com/watch?v=POuaCNJsUcY', start: 6794, end: 7104 }, // 行61 1:53:14〜1:58:24
  },
};
