const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this._songs = [];
  }

  addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const uniqueId = nanoid();
    const id = 'song-'.concat(uniqueId);

    const newSong = {
      title, year, genre, performer, duration, albumId, id,
    };

    this._songs.push(newSong);

    const isSuccess = this._songs.filter((song) => song.id === id).length > 0;

    if (!isSuccess) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return id;
  }

  getSongs() {
    return this._songs;
  }

  getSongById(id) {
    const song = this._songs.filter((s) => s.id === id)[0];
    if (!song) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
    return song;
  }

  editSongById(id, {
    title, year, genre, performer, duration, albumId,
  }) {
    const idx = this._songs.findIndex((n) => n.id === id);
    if (idx === -1) {
      throw new NotFoundError('Gagal memperbarui lagu. id tidak ditemukan');
    }

    this._songs[idx] = {
      ...this._songs[idx],
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    };
  }

  deleteSongById(id) {
    const idx = this._songs.findIndex((n) => n.id === id);

    if (idx === -1) {
      throw new NotFoundError('Lagu gagal dihapus. id tidak ditemukan');
    }

    this._songs.splice(idx, 1);
  }
}

module.exports = SongsService;
