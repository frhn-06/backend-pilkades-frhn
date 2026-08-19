import { Express } from "express"
import swaggerUi from "swagger-ui-express"
import swaggerDocument from './swagger-output.json'

import fs from 'fs'
import path from 'path'

const swaggerDocs = (app: Express) => {
    const css = fs.readFileSync(path.resolve(__dirname, "../../node_modules/swagger-ui-dist/swagger-ui.css"), "utf-8");

    app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
        customCss: css
    }));
}

export default swaggerDocs;