# WDS-Setup-ReactRefresh-Babel

Simple webpack setup for development only. Including :
- :heavy_check_mark: development setup
- :heavy_check_mark: babel setup for typescript, react and react-refresh
- :heavy_check_mark: webpack-dev-server (API)
- :heavy_check_mark: express app server
- :heavy_check_mark: react-refresh ([react-refresh-webpack-plugin](https://github.com/pmmmwh/react-refresh-webpack-plugin/))
- :heavy_check_mark: typescript (with ts-loader)
- :heavy_check_mark: webpack-assets-manifest
- :heavy_check_mark: using template (with nunjucks)

- :x: production setup
- :x: test

## Running

```npm run dev```

By default, express app will be served on port 5000 and wds on port 8080. If use other port for WDS_PORT, dont forget to also change asset manifest URI and staticURI.