# Build the backend app container
docker build \
    -t g-feedback-app:v4.0 \
    -t g-feedback-app:latest \
    -t gulcan82/g-feedback-app:v4.0 \
    -t gulcan82/g-feedback-app:latest .

# Push the images to the Docker Hub
docker push gulcan82/g-feedback-app:v4.0
docker push gulcan82/g-feedback-app:latest

# Create a docker network for the app
docker network create feedback-app-nw

# Run the postgres database container
docker run \
    --name postgres-db \
    --network feedback-app-nw \
    -p 5432:5432 \
    -e POSTGRES_PASSWORD=password \
    -e POSTGRES_DB=feedbackdb \
    -v feedback-app-data:/var/lib/postgresql/data \
    -d \
    --rm \
    postgres

# Run the backend app container
docker run \
    --name g-feedback-app \
    --network feedback-app-nw \
    -p 3030:3000 \
    -e DB_USER=postgres \
    -e DB_HOST=postgres-db \
    -e DB_NAME=feedbackdb \
    -e DB_PASSWORD=password \
    -e DB_PORT=5432 \
    -d \
    --rm \
    g-feedback-app

# Stop the containers
docker stop feedback-app postgres-db

# Remove the containers
docker rm feedback-app postgres-db

# Start the app with Docker Compose
docker-compose up --build