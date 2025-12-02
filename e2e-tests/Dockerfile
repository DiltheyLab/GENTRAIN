FROM cypress/factory
WORKDIR /e2e-tests
COPY package*.json ./

RUN npm ci

# Install Cypress binaries
RUN npx cypress install 

COPY . .