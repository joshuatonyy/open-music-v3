const ClientError = require('../../exceptions/ClientError');

class ExportsHandler {
  constructor(service, validator, playlistsService) {
    this._service = service;
    this._validator = validator;
    this._playlistsService = playlistsService;

    this.postExportMusicsHandler = this.postExportMusicsHandler.bind(this);
  }

  async postExportMusicsHandler(request, h) {
    try {
      this._validator.validateExportMusicsPayload(request.payload);
      const { id } = request.auth.credentials;
      const { playlistId } = request.params;
      const { targetEmail } = request.payload;
      await this._playlistsService.verifyPlaylistOwner(playlistId, id);
      const message = {
        playlistId, targetEmail,
      };
      await this._service.sendMessage('export:playlists', JSON.stringify(message));

      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // Server error
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = ExportsHandler;
