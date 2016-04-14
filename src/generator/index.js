'use strict';

import config from '../config';
import idgenerator from './idgenerator';
import sequence_generator from './sequence_generator';

let genConfig = config.get();
export default{
  idgenerator: genConfig.idgenerator === 'idgenerator'? idgenerator:
    typeof genConfig.idgenerator === 'function'? genConfig.idgenerator: idgenerator,
  sequence_generator: genConfig.sequence_generator === 'sequence_generator'? sequence_generator:
    typeof genConfig.sequence_generator === 'function'? genConfig.sequence_generator: sequence_generator,
}
