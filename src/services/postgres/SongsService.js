const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const uniqueId = nanoid();
    const id = 'song-'.concat(uniqueId);
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs(title, performer) {
    let query;
    if (title && performer) {
      query = {
        text: 'SELECT * FROM songs WHERE LOWER(title) LIKE $1 AND LOWER(performer) LIKE $2',
        values: [`%${title}%`, `%${performer}%`],
      };
    } else if (title && !performer) {
      query = {
        text: 'SELECT * FROM songs WHERE LOWER(title) LIKE $1',
        values: [`%${title}%`],
      };
    } else if (performer && !title) {
      query = {
        text: 'SELECT * FROM songs WHERE LOWER(performer) LIKE $1',
        values: [`%${performer}%`],
      };
    } else {
      query = {
        text: 'SELECT * FROM songs',
      };
    }
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song not found');
    }

    return result.rows[0];
  }

  async editSongById(id, {
    title, year, genre, performer, duration, albumId,
  }) {
    let query;
    if (albumId) {
      query = {
        text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, albumId = $6 WHERE id = $7 RETURNING id',
        values: [title, year, genre, performer, duration, albumId, id],
      };
    } else {
      query = {
        text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5 WHERE id = $6 RETURNING id',
        values: [title, year, genre, performer, duration, id],
      };
    }

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song not found');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Songs not found');
    }
  }
}

module.exports = SongsService;
