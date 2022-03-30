const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor() {
    this._albums = [];
  }

  addAlbum({ name, year }) {
    const uniqueId = nanoid();
    const id = 'album-'.concat(uniqueId);

    const newAlbum = { name, year, id };
    this._albums.push(newAlbum);

    const isSuccess = this._albums.filter((album) => album.id === id).length > 0;

    if (!isSuccess) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return id;
  }

  getAlbumById(id) {
    const album = this._albums.filter((alb) => alb.id === id)[0];
    if (!album) {
      throw new NotFoundError('Album tidak ditemukan');
    }
    return album;
  }

  editAlbumById(id, { name, year }) {
    const idx = this._albums.findIndex((n) => n.id === id);
    if (idx === -1) {
      throw new NotFoundError('Gagal memperbarui album. id tidak ditemukan');
    }

    this._albums[idx] = { ...this._albums[idx], name, year };
  }

  deleteAlbumById(id) {
    const idx = this._albums.findIndex((n) => n.id === id);
    if (idx === -1) {
      throw new NotFoundError('Catatan gagal dihapus. id tidak ditemukan');
    }

    this._albums.splice(idx, 1);
  }
}

module.exports = AlbumsService;
