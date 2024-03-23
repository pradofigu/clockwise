<h1 align="center">Clockwise</h1>

<p align="center">
  <a href="https://app.getpostman.com/run-collection/1973162-da818907-801f-42f8-8cad-0e9319cfe423?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D1973162-da818907-801f-42f8-8cad-0e9319cfe423%26entityType%3Dcollection%26workspaceId%3Dd5d82760-79ae-41f9-a3f7-71f432606f90" target="_blank"><img src="https://run.pstmn.io/button.svg" alt="Run in Postman"></a>
</p>

Aplicação responsável por controlar entrada e saída de funcionários em um "sistema de pontos".
> P.S.: Esta solução é um MVP de uma solução completa, apresentada nos vídeos anexos neste documento.

## Tecnologias
- Typescript
- Nest.js
- TypeORM
- Docker
- Jest

## Como Executar?
Clockwise é uma aplicação conteinerizada, e todas as suas dependências estão contidas dentro de um `docker-compose`. Para executar a aplicação, execute em seu terminal:
```bash
$ docker-compose up --build
```

Após isso, acesse http://localhost:3000 ou utilize a collection do Postman clicando no botão Laranja acima.

## Arquitetura da Solução

A seguir é possivel conferir a modelagem da solução seguindo o [C4-Model](https://c4model.com/) de Arquitetura de Software.

### 00 - Apresentação do Sistema de Ponto (Videos)

* [Diagrama de Contexto](https://drive.google.com/file/d/1j72wHzdBX9-wtaJswLj4Cje7J-P0tmGo/view?usp=drive_link)
* [Diagrama de Pipeline](https://drive.google.com/file/d/1ItkymvwbfrRB9_PWOb2fXVqYaJCAjrh2/view?usp=sharing)
* [Diagrama de Infraestrutura](https://drive.google.com/file/d/1Bmvg6Iirn9Egw3E4BTnQGWoZZarIWG_l/view?usp=sharing)

### 01 - System Context

![alt text](docs/01-ponto-system-context.png)

### 02 - Pipeline

![alt text](docs/02-pipeline-diagram.png)

### 02 - Infraestrutura

![alt text](docs/03-infrastructure-diagram.png)
