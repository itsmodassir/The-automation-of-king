import { Response } from 'express';
import { MetaService } from './meta.service';
export declare class MetaController {
    private metaService;
    constructor(metaService: MetaService);
    handle(code: string, state: string, res: Response): Promise<void>;
}
