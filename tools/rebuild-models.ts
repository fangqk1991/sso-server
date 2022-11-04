import { DBModelSchema, ModelGenerator } from '@fangcha/generator'
import { SafeTask } from '@fangcha/tools'
import { DemoDBOptions } from './db-config'

const modelTmpl = `${__dirname}/model.tmpl.ejs`
const extendTmpl = `${__dirname}/class.extends.model.ejs`

const generator = new ModelGenerator({
  dbConfig: DemoDBOptions,
  tmplFile: modelTmpl,
  extTmplFile: extendTmpl,
})

const generalDataSchemas: DBModelSchema[] = [
  {
    generator: generator,
    tableName: 'fc_sso_client',
    outputFile: `${__dirname}/../src/models/auto-build/__SsoClient.ts`,
    extFile: `${__dirname}/../src/models/extensions/_SsoClient.ts`,
    reloadOnAdded: true,
    reloadOnUpdated: true,
  },
  {
    generator: generator,
    tableName: 'fc_user_auth',
    outputFile: `${__dirname}/../src/models/auto-build/__UserAuth.ts`,
    extFile: `${__dirname}/../src/models/extensions/_UserAuth.ts`,
    primaryKey: ['client_id', 'user_uid'],
    reloadOnAdded: true,
    reloadOnUpdated: true,
  },
]

SafeTask.run(async () => {
  for (const schema of generalDataSchemas) {
    const generator = schema.generator!
    const data = await generator.generateData(schema)
    generator.buildModel(schema, data)
  }
})
