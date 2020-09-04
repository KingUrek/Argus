pipeline {
  agent any
  stages {
    stage('Integration Tests') {
      steps {
        tool(name: 'nodejs', type: 'nodejs')
        sh 'npm test'
        sh 'echo "Os testes passaram com sucesso!"'
      }
    }

  }
}