# Collaborative text editor



## Features

Real time collaborative text editor built with:  
server side:
- express
- mongodb
- mongoose
- socket.io

client side:
- nextjs
- quill
- next-auth
- react-toastify


Testing is done using vitest and jest-dom for frontend and jest and supertest for api.  



## Setup and Installation

*Use your favoeite package manager npm, pnpm or yarn to install dependencies.*

Frontend is built with nextjs 14 with app router, wrapped inside `src` directory. It uses `webpack`but if you want to change it to `turbopack` you need to add **--turbo** to **dev script** in *package.json*

```
"scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest --coverage"
  },

```


### Clone this repository:



```
git clone https://github.com/rez433/js_ramverk.git

cd server
pnpm i
pnpm dev

# and from the root of repo:
cd client
pnpm i
pnpm dev

```
