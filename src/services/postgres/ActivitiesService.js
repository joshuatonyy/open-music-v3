/* eslint-disable default-param-last */
/* eslint-disable camelcase */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class ActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addActivity(playlistId, userId, action, songId = 'kosong') {
    const id = `activity-${nanoid(16)}`;
    const time = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('fail');
    }
    return result.rows[0].id;
  }

  async getActivities(playlistId) {
    const query_isi_playlist = {
      text: `SELECT u.username, s.title, a.action, a.time FROM playlist_song_activities a
              LEFT JOIN playlists p ON p.id = a.playlist_id
              LEFT JOIN users u ON u.id = a.user_id
              LEFT JOIN songs s ON s.id = a.song_id
              WHERE a.playlist_id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query_isi_playlist);
    return result.rows;
  }
}

module.exports = ActivitiesService;
