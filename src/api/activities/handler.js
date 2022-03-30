const ClientError = require('../../exceptions/ClientError');

class ActivitiesHandler {
  constructor(service, playlistsService) {
    this._service = service;
    this._playlistsService = playlistsService;

    this.getActivitiesHandler = this.getActivitiesHandler.bind(this);
  }

  async getActivitiesHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;
      await this._playlistsService.verifyPlaylistAccess(id, credentialId);
      const acti = await this._service.getActivities(id);
      return {
        status: 'success',
        data: {
          playlistId: id,
          activities: [...acti],
        },
      };
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

module.exports = ActivitiesHandler;
