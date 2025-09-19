// New types
interface Parameter {
  name: string
  // allow additional properties from OpenAPI parameter objects
  [key: string]: any
}

interface Operation {
  parameters?: Parameter[]
  // allow additional operation properties
  [key: string]: any
}

interface ClientConfig {
  format: string
  target: string
}

interface SchemasConfig {
  dateType: string
  unknownType: string
}

interface NamingConfig {
  types: string
  functions: string
  properties: string
}

interface Plugin {
  name: string
  transformOperation?: (operation: Operation) => Operation
}

interface OrpcConfig {
  input: string
  output: string
  client: ClientConfig
  server: boolean
  zod: boolean
  schemas: SchemasConfig
  naming: NamingConfig
  plugins: Plugin[]
}

export default ({
  input: '../yml_files/*.yml',
  output: './src/generated',
  client: {
    format: 'typescript',
    target: 'fetch',
  },
  server: false, // We're only generating client code
  zod: true,
  schemas: {
    dateType: 'string',
    unknownType: 'unknown',
  },
  naming: {
    types: 'PascalCase',
    functions: 'camelCase',
    properties: 'camelCase',
  },
  plugins: [
    // Custom plugin to handle TikTok API specifics
    {
      name: 'tiktok-api-plugin',
      transformOperation: (operation: Operation) => {
        // Add access token handling
        if (operation.parameters) {
          operation.parameters = operation.parameters.filter(
            p => p.name !== 'Access-Token'
          )
        }
        return operation
      }
    }
  ]
} as OrpcConfig)