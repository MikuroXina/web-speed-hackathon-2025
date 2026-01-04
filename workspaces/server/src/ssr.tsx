import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fastifyStatic from '@fastify/static';
import { StoreProvider } from '@wsh-2025/client/src/app/StoreContext';
import { createRoutes } from '@wsh-2025/client/src/app/createRoutes';
import { createStore } from '@wsh-2025/client/src/app/createStore';
import type { FastifyInstance } from 'fastify';
import { createStandardRequest } from 'fastify-standard-request-reply';
import { Minipass } from 'minipass';
import { StrictMode } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router';

export function registerSsr(app: FastifyInstance): void {
  app.register(fastifyStatic, {
    prefix: '/public/',
    root: [
      path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../client/dist'),
      path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../public'),
    ],
  });

  app.get('/favicon.ico', (_, reply) => {
    return reply.status(404).send();
  });

  app.get('/*', async (req, reply) => {
    // @ts-expect-error ................
    const request = createStandardRequest(req, reply);

    const store = createStore({});
    const handler = createStaticHandler(createRoutes(store));
    const context = await handler.query(request);

    if (context instanceof Response) {
      return reply.send(context);
    }

    const router = createStaticRouter(handler.dataRoutes, context);

    const stream = await new Promise<Minipass>((resolve, reject) => {
      const duplex = new Minipass();
      const pipeable = renderToPipeableStream(
        <html lang="ja">
          <head>
            <meta charSet="UTF-8" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <link href="/public/main.css" rel="stylesheet" />
          </head>
          <body>
            <StrictMode>
              <StoreProvider createStore={() => store}>
                <StaticRouterProvider context={context} router={router} />
              </StoreProvider>
            </StrictMode>
          </body>
        </html>,
        {
          bootstrapScripts: ['/public/main.js'],
          onShellError(error) {
            clearTimeout(abortTimer);
            reject(new Error('renderToPipeableStream occurred shell error', { cause: error }));
          },
          onShellReady() {
            clearTimeout(abortTimer);
            resolve(pipeable.pipe(duplex));
          },
        },
      );
      const abortTimer = setTimeout(() => {
        pipeable.abort();
        reject(new Error('renderToPipeableStream aborted by timeout'));
      }, 10 * 1000);
    });
    return reply.type('text/html').send(stream);
  });
}
