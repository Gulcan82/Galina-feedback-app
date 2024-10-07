pipeline {
    agent {
        kubernetes {
            label 'jenkins-docker-agent'
            yamlFile 'kubernetes_jenkins/jenkins-pod-template.yaml'
        }
    }

    triggers {
        pollSCM('H/2 * * * *')
    }
    
    environment {
        GITHUB_REPO = 'https://github.com/Gulcan82/Galina-feedback-app-frontend.git'
        DOCKER_IMAGE = 'gulcan82/g-feedback-app-frontend:pipeline-test'
        DOCKER_CREDENTIALS_ID = 'dockerhub-token'
    }
    
    stages {        
        stage('Checkout') {           
            steps {
                git url: "${GITHUB_REPO}", branch: 'master'
            }            
        }       
        stage('Docker Build') {   
            steps {
                echo 'Building the app...'
                container('docker') {
                    sh 'docker build -t $DOCKER_IMAGE .'
                }
                echo 'Build successful.'
            }    
        }
        stage('Docker Push') {
            steps {
                echo 'Pushing the image to Docker Hub...'
                container('docker') {
                    script {
                        docker.withRegistry('', "${DOCKER_CREDENTIALS_ID}") {
                            sh 'docker push $DOCKER_IMAGE'
                        }
                    }
                }
                echo 'Push successful.'
            }
        }
        stage('Kubernetes Deploy') {
            steps {
                echo 'Deploying to Kubernetes cluster...'
                container('kubectl') {
                    // Hier können weitere Deployments hinzugefügt werden
                    sh 'kubectl apply -f kubernetes/feedback-frontend.yaml'
                }
                echo 'Deployment successful.'
            }
        }
        stage('Check App Status') {
            echo 'Checking if the App is reachable...'
            script {
                def retries = 30
                def delay = 10
                def url = "http://feedback-app-api-service:3000/feedback"

                for (int i 0; i < retries; i++) {
                    def result = sh(script: "curl -o /dev/null -w '%{http_code}' $url", returnStdout: true).trim()
                    
                }


            }
        }
         stage('Integration Tests') {
            steps {
                echo 'Running integration tests...'
                container('k6') {
                    sh 'k6 run --env BASE_URL=http://feedback-app-api-service:3000 ./tests/feedback-api.integration.js'
                }
                echo 'Integration tests ready.'
            }
        }
    }   
}
 