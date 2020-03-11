import {syncAction} from '../../utils/request';

const INVITION = 'invition'

export const statusCheck = (data, token) => syncAction({
  method: 'InvitationManager.statusCheck',
  type: INVITION,
  data,
  token
});

export const getLimitConstraints = (data, token) => syncAction({
  method: 'InvitationManager.getLimitConstraints',
  type: INVITION,
  data,
  token
});

export const getPanelDemand = (data, token) => syncAction({
  method: 'PanelQuota.getPanelDemand',
  type: INVITION,
  data,
  token
});

