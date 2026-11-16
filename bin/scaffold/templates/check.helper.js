/* eslint-disable no-unused-vars */

// Controller code
import __SUBMIT_SERVICE_NAME__ from '__SUBMIT_SERVICE_PATH__'
import __VIEW_SERVICE_NAME__ from '__VIEW_SERVICE_PATH__'

export async function __VIEW_HANDLER_NAME__(request, h) {
  const { sessionId } = request.params

  const pageData = await __VIEW_SERVICE_NAME__(sessionId)

  return h.view('__VIEW_PATH__', pageData)
}

export async function __SUBMIT_HANDLER_NAME__(request, h) {
  const { sessionId } = request.params

  const { redirectUrl } = await __SUBMIT_SERVICE_NAME__(sessionId)

  return h.redirect(redirectUrl)
}

// Route code
const routes = [
  {
    method: 'GET',
    options: {
      auth: {
        access: {
          scope: ['']
        }
      },
      handler: __VIEW_HANDLER_NAME__
    },
    path: '__ROUTE_PATH__'
  },
  {
    method: 'POST',
    options: {
      auth: {
        access: {
          scope: ['']
        }
      },
      handler: __SUBMIT_HANDLER_NAME__
    },
    path: '__ROUTE_PATH__'
  }
]
