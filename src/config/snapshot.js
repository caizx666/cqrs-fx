export default {
  provider: 'event_number',
  storage: 'mysql',  // redis mysql
  table: 'snapshots',
  // immediate: Indicates that immediate snapshot create/update should be performed.
  // postpone: Indicates that the creating/updating of the snapshots  would be postponed to a later scenario.
  option: 'immediate',
  // 快照的保存周期，默认每100个事件保存一次快照
  numberOfEvents: 100,
};
