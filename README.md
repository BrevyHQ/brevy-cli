# Brevy Cli
Brevy-Cli is a command line tool that aims to make it easy to develop and scaffold projects in the Brevy monorepo.

## Usage
Below, you will find a current list of commands, including their parameters and flags.

### Generate API Client code for a given server project
```bash
brevy apigen [project]

    Accepted Options: 'all' + every server project's name.
```

### Create new module in a specific project, generating a skeleton
```bash
brevy create module [name] [generators] <--p, --project>

  Positional arguments:
      [name]: The name of the module to create.
    
      [generators]: A comma-separated list of generators to use.
          Accepted generators: 'create', 'read', 'update', 'delete' # + 'core' (always on by default)
      
  Flags:
      <-p, --project>: The name of the project to create the module in.
```

### Create new entity in a specific project and module, generating a skeleton
```bash
brevy create entity [name] <--p, --project> <--m, --module>

  Positional arguments:
      [name]: The name of the entity to create.
      
  Flags:
      <-p, --project>: The name of the project to create the entity in.
      
      <-m, --module>: The name of the module to create the entity in.
```

## Template files
Template files are stored in the main monorepo.
When you initialize brevy-cli for the first time and configure the monorepo path,
templates will be picked up automagically.

This also allows to configure the existing templates without having to update the CLI and expand on them in their corresponding projects.

## Requirements
To be able to use the API generation functionality, you will need to have Java Runtime installed.
This is because the API generation is done using [OpenAPI Generator CLI](https://github.com/OpenAPITools/openapi-generator-cli).

You can download the Runtime environment from: https://www.java.com/en/download/manual.jsp.
