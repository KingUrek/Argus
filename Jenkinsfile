pipeline {
  agent {
    node {
      label 'Node test'
    }

  }
  stages {
    stage('Testing') {
      steps {
        sh 'npm run test'
      }
    }

    stage('') {
      steps {
        echo 'Os testes Ocorreram com sucesso'
      }
    }

  }
}