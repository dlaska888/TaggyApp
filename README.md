# TaggyApp

## Project Description

Tag-based file management system, enabling users to create                    collaborative workspaces for sharing, viewing, and editing files.
Offers advanced search functionality, allowing workspace  members to quickly locate the right files. Access to files is role  based, with options for workspace Owner, Administrator,  Moderator or Member. 

## Table of Contents

- [Project Description](#project-description)
- [Table of Contents](#table-of-contents)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Technologies](#technologies)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

Clone repository code and proceed to [Installation](#installation).

## Installation

Pre-requisites:
 - docker installed

App configuration can be found in [.env](.env) file (passwords, ports, ssl, etc.).

After initial configuration, run the following commands in the root directory of the project:

```docker compose up```

Or if you want to run it in the background:

```docker compose up -d```

## Usage

TaggyApp is a file management system. After logging in (Register with email or Google account), you will be welcomed with your first workspace. You can add files your files here and tag them with useful metadata, which will help you find them later. You can also share your workspace with other users, who can view, edit or delete files, based on their role.

## Features

- Files
  - create (with tags)
  - edit
  - delete
  - search with multiple query options
- Workspaces
    - create
    - edit
    - delete
    - share with other users
- Account management

## Technologies

- Frontend
  - Angular 18
  - PrimeNG components
- Backend (API)
  - ASP<span>.</span>NET Core 8
- Database
  - PostgreSQL
- File storage
    - Azure Blob Storage
    - Azure Functions (thumbnail generation)
- Containerization
  - Docker

## Contributing

Yet to be determined.

## License

MIT License

Copyright (c) 2023 Dawid Laska

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


---

TaggyApp is maintained by Dawid Laska. You can reach me at daw.laska@gmail.com.
