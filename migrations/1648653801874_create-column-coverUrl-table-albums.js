/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn('albums', {
    coverUrl: {
      type: 'TEXT',
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('albums', 'coverUrl');
};
