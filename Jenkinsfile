pipeline {
  agent any
  stages {
    stage('Integration Tests') {
      steps {
        sh 'npm test'
        sh 'echo "Os testes passaram com sucesso!"'
      }
    }

  }
}