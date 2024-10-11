import { createContext } from 'react';
import { createContextualCan } from '@casl/react';
import { PureAbility } from '@casl/ability';

const ability = new PureAbility();

export const AbilityContext = createContext<PureAbility>(ability);
export const Can = createContextualCan(AbilityContext.Consumer);
