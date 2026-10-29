/* Upyps release schedule. Edit the dates here, no other file needs to change.
   from / to : first and last day an item is visible (YYYY-MM-DD, visitor's local date). Without 'to' the item stays.
   hold: true : keeps the item hidden whatever the date. Remove it (or set false) once you decide to show the item.
   Preview a date: add ?preview=2026-11-10 to the page address. Add &holds=off to also preview held items. */
window.UPYPS_SCHEDULE = {
  'sessions': { from: '2026-10-26' },
  'quotes': { from: '2026-10-26' },
  'webinars': { from: '2026-10-26' },
  'education': { from: '2026-10-26' },
  'app': { from: '2026-10-26' },
  'hfmhome': { from: '2026-10-26' },
  'calculator': { from: '2026-11-02' },
  'cent': { from: '2026-11-02' },
  'analysis': { from: '2026-11-02' },
  'demo': { from: '2026-11-09' },
  'insights': { from: '2026-11-09' },
  'etfs': { from: '2026-11-12' },
  'live': { from: '2026-11-16' },
  'tradersboard': { from: '2026-11-23', hold: true },
  'advantages': { from: '2026-11-30', hold: true },
  'follower': { from: '2026-11-23', hold: true },
  'strategy': { from: '2026-11-23', hold: true },
  'pamm': { from: '2026-11-23', hold: true },
  'shield': { from: '2026-12-07', hold: true },
  'infinityx': { from: '2026-12-14', hold: true },
  'spot-tools': { from: '2026-10-26', to: '2026-11-01' },
  'spot-cent': { from: '2026-11-02', to: '2026-11-08' },
  'spot-demo': { from: '2026-11-09', to: '2026-11-15' },
  'spot-etfs': { from: '2026-11-16', to: '2026-11-22' },
};
