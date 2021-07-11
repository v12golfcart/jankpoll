### Gotchas

- to make NGROK handle headers properly with react:
  - ngrok http 3000 -host-header="localhost:3000" --hostname=jankpoll.ngrok.io
  - https://newbedev.com/invalid-host-header-when-ngrok-tries-to-connect-to-react-dev-server
- to make internal proxy for express server work:
  - https://create-react-app.dev/docs/proxying-api-requests-in-development
- discord random stuff
  - to get color ints: http://www.shodor.org/stella2java/rgbint.html
