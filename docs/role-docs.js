// role-docs.js

module.exports = {
    '/api/role': {
      get: {
        tags: ['Roles'],
        description: 'Obtener todos los roles',
        security: [{ unoweb_authorization: [] }], // Requiere autenticación con token
        responses: {
          '200': {
            description: 'Lista de roles devuelta con éxito',
            schema: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'integer',
                    description: 'ID del rol',
                    example: 1
                  },
                  name: {
                    type: 'string',
                    description: 'Nombre del rol',
                    example: 'Administrador'
                  }
                }
              }
            }
          },
          '401': {
            description: 'Token no proporcionado o inválido'
          }
        }
      },
      post: {
        tags: ['Roles'],
        description: 'Crear un nuevo rol',
        security: [{ unoweb_authorization: [] }],
        parameters: [
          {
            name: 'body',
            in: 'body',
            required: true,
            description: 'Datos del nuevo rol',
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Nombre del rol',
                  example: 'Editor'
                }
              }
            }
          }
        ],
        responses: {
          '201': {
            description: 'Rol creado exitosamente'
          },
          '400': {
            description: 'Datos incorrectos o incompletos'
          },
          '401': {
            description: 'Token no proporcionado o inválido'
          }
        }
      }
    },
    '/api/role/{id}': {
      put: {
        tags: ['Roles'],
        description: 'Actualizar un rol existente',
        security: [{ unoweb_authorization: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID del rol',
            type: 'integer',
            example: 1
          },
          {
            name: 'body',
            in: 'body',
            required: true,
            description: 'Datos actualizados del rol',
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Nuevo nombre del rol',
                  example: 'Editor'
                }
              }
            }
          }
        ],
        responses: {
          '200': {
            description: 'Rol actualizado con éxito'
          },
          '404': {
            description: 'Rol no encontrado'
          },
          '401': {
            description: 'Token no proporcionado o inválido'
          }
        }
      },
      delete: {
        tags: ['Roles'],
        description: 'Eliminar un rol por ID',
        security: [{ unoweb_authorization: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID del rol',
            type: 'integer',
            example: 1
          }
        ],
        responses: {
          '204': {
            description: 'Rol eliminado con éxito'
          },
          '404': {
            description: 'Rol no encontrado'
          },
          '401': {
            description: 'Token no proporcionado o inválido'
          }
        }
      }
    }
  };
  