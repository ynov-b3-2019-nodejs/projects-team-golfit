let scoreboard;

scoreboard = new p5.Table();

scoreboard.addColumn('Pseudo');
scoreboard.addColumn('Coups');
scoreboard.addColumn('Score');

const addRow = scoreboard.addRow();

addRow.setString('Pseudo', 'Le boss');
addRow.setString('Coups', '0');
addRow.setString('Score', '150');