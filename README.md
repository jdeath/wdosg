# wDOSg

A Simple web server to manage and run DOS based games on browser.

## Overview

**wDOSg** (web DOS games) is a centralized DOS game library that allows you to fetch metadata from [_IGDB_](https://www.igdb.com/) 
and run your games on the browser through [_js-dos_](https://github.com/caiiiycuk/js-dos), using a minimalistic configuration.

<!--toc:start-->

- [wDOSg](#wDOSg)
  - [Overview](#overview)
  - [Features](#features)
  - [Screenshots](#screenshots)
  - [Roadmap](#roadmap)
- [Installation](#installation)
  - [Game Bundles](#game-bundles)
  - [How it works](#how-it-works)
  - [Metadata](#metadata)
  - [Requirements](#requirements)
    - [Docker compose example](#docker-compose-example)

<!--toc:end-->

## Features

- Centralized repository to host your DOS games
- Automatically fetches game metadata and artworks from _IGDB_ (requires authentication information)
- Ability to edit information for games
- Web access: access your library from anywhere
- Supports games saving capabilities through _js-dos_ (single browser / device)
- Dark and light themes

## Screenshots

**Home Screen - Dark Theme**

![Image](https://github.com/user-attachments/assets/0909ed57-f10f-4bdf-b2ce-0946047b379d)

**Home Screen - Light Theme**

![Image](https://github.com/user-attachments/assets/45a11325-344d-4ab7-ae47-d406650cb7c6)

**Game Creation: Metadata fetched from IGDB**

![Image](https://github.com/user-attachments/assets/0b5db5ad-0de1-424f-b23c-9af7079c692b)

**Game Details**

![Image](https://github.com/user-attachments/assets/b01fa54c-d8ee-4348-9659-0257408bbd49)

## Roadmap

- [ ] Basic features
  - [x] Add / remove games
  - [x] Edit games information
  - [x] Download IGBDB metadata
  - [x] Local save games / states
  - [x] Dark / Light themes
  - [ ] User authentication
- [ ] Desired features
  - [ ] Cloud saving (enabled through _js-dos_)
  - [ ] _js-dos_ per-game configuration
  - [ ] Create entry from game folder - as opposed to a _jsdos bundle_ file
  - [ ] Support for _js-dos_ v8 (currently v7)
  - [ ] Ability to scan library folder (bulk import)

> [!CAUTION]
> wDOSg has been imagined as a _convenient_ way to run DOS games. It has not been designed to be exposed to the open 
> internet. **Make sure** your instance is **NOT** exposed. 

# Installation

> [!TIP]
> Familiarize with [js-dos](https://github.com/caiiiycuk/js-dos) project to fully understand emulator capabilities.

### Game Bundles

**wDOSg** currently supports games as [js-dos bundle files](https://js-dos.com/jsdos-bundle.html): a **.zip** archive that 
contains the game itself and a _js-dos_ configuration file and a _dosbox.conf_ file.

Before loading a game into **wDOSg**, you should pack it. The preferred / recommended way to do it is to go through
the _Game Studio_ feature from [DOS.Zone](https://dos.zone/studio/).

### How it works

Each game gets deployed into a separated directory, is packed as a js-dos bundle along with a webpage, which is
ultimately served so the underlying _js-dos_ engine executes the game on screen.

### Metadata

**wDOSg** uses _IGDB_ as a metadata provider to fetch metadata for your games. To use the _IGDB_ metadata provider, please 
follow these [instructions](https://api-docs.igdb.com/#account-creation).

### Requirements

> - Docker
> - Credentials for [IGDB](#igdb) as environment variables:

- TWITCH_CLIENT_ID
- TWITCH_APP_ACCESS_TOKEN

#### Docker compose example

The currently recommended way to run the server is via Docker.

This is a `docker-compose.yml` example file:

```yaml
services:
  wdosg:
    image: soulraven1980/wdosg:latest
    container_name: wdosg
    restart: unless-stopped
    ports:
      - 3001:3001 # to access the web client
    volumes:
      - your_library_location:/app/wdosglibrary # directory containing your library
      - your_db_location:/app/database # directory containing your database
    environment:
      - TWITCH_CLIENT_ID=xxxx # Your IGDB (Twitch) client ID
      - TWITCH_APP_ACCESS_TOKEN=xxxx # Your IGDB (Twitch) Token - **NOT your secret**
    networks:
      - proxy # assuming "proxy" is the network for the reverse proxy (i.e. Traefik)

networks:
  proxy:
    external: true
```

Run `docker-compose up -d` in the directory containing your `docker-compose.yml` file to start the service.

Open http://localhost:3001 (or the port configured on your docker compose file) and enjoy!
