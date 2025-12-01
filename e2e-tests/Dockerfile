FROM cypress/included:15.6.0
WORKDIR /e2e
COPY package*.json ./
RUN npm ci
COPY . .

