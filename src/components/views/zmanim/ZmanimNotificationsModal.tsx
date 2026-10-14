import React, { useState } from 'react';
import { Bell, CheckCircle2, X, Clock, ShieldCheck, Sparkles, Flame, ShieldAlert, AlertCircle, Calendar as CalendarIcon } from 'lucide-react';
import { ZmanimNotificationService } from '../../../services/zmanim/ZmanimNotificationService';

interface ZmanimNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationName: string;
}

export const ZmanimNotificationsModal: React.FC<ZmanimNotificationsModalProps> = ({
  isOpen,
  onClose,
  locationName
}) => {
  // Initialize state with real local storage settings or defaults
  const [prayerReminders, setPrayerReminders] = useState(() => localStorage.getItem('bnei_menashe_notif_prayers') !== 'false');
  const [prayerLeadTime, setPrayerLeadTime] = useState(() => localStorage.getItem('bnei_menashe_notif_prayer_lead') || '15');
  const [candleReminders, setCandleReminders] = useState(() => localStorage.getItem('bnei_menashe_notif_candles') !== 'false');
  const [fastReminders, setFastReminders] = useState(() => localStorage.getItem('bnei_menashe_notif_fasts') !== 'false');
  const [holidayReminders, setHolidayReminders] = useState(() => localStorage.getItem('bnei_menashe_notif_holidays') !== 'false');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Read permission state
  const [permission, setPermission] = useState(() => ZmanimNotificationService.getPermissionState());

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const granted = await ZmanimNotificationService.requestPermission();
    setPermission(ZmanimNotificationService.getPermissionState());
    if (granted) {
      ZmanimNotificationService.startNotificationEngine();
    }
  };

  const handleSave = () => {
    // Persist notification preferences in local state
    localStorage.setItem('bnei_menashe_notif_prayers', prayerReminders.toString());
    localStorage.setItem('bnei_menashe_notif_prayer_lead', prayerLeadTime);
    localStorage.setItem('bnei_menashe_notif_candles', candleReminders.toString());
    localStorage.setItem('bnei_menashe_notif_fasts', fastReminders.toString());
    localStorage.setItem('bnei_menashe_notif_holidays', holidayReminders.toString());

    // Immediately reschedule/update alarms in the engine
    ZmanimNotificationService.startNotificationEngine();

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Halachic Notification Engine
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Calibrated alerts for {locationName}
            </p>
          </div>
        </div>

        {/* Permission Status Banner */}
        {permission === 'default' && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <p className="text-xs font-bold text-amber-800 dark:text-amber-400">Notifications Inactive</p>
                <p className="text-[10px] text-amber-700 dark:text-amber-500 mt-0.5">Authorize browser alerts to receive real-time local push alerts.</p>
              </div>
            </div>
            <button
              onClick={handleRequestPermission}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] transition-all self-stretch sm:self-auto text-center"
            >
              Authorize Alerts
            </button>
          </div>
        )}

        {permission === 'denied' && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex gap-2.5">
            <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-rose-800 dark:text-rose-400">Permissions Blocked</p>
              <p className="text-[10px] text-rose-700 dark:text-rose-500 mt-0.5">
                Notifications are disabled in your browser settings. Please unlock permissions for this site to hear alerts.
              </p>
            </div>
          </div>
        )}

        {permission === 'granted' && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex gap-2.5 items-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400">Push Alarms Authorized</p>
              <p className="text-[10px] text-emerald-700 dark:text-emerald-500">Service worker notification channel is fully active.</p>
            </div>
          </div>
        )}

        <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
          {/* Prayer Reminders */}
          <div className="pt-2 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Prayer Reminders</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Alerts before Sof Zman Shema, Sof Zman Tefillah, and Mincha deadlines.
              </p>
              {prayerReminders && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Lead time:</span>
                  <select
                    value={prayerLeadTime}
                    onChange={e => setPrayerLeadTime(e.target.value)}
                    className="text-xs px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200"
                  >
                    <option value="10">10 minutes before</option>
                    <option value="15">15 minutes before</option>
                    <option value="30">30 minutes before</option>
                  </select>
                </div>
              )}
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={prayerReminders}
                onChange={e => setPrayerReminders(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* Candle Lighting Reminders */}
          <div className="pt-4 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Candle Lighting Alerts</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Triggered exactly at custom candle lighting time on Fridays and Erev Yom Tov.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={candleReminders}
                onChange={e => setCandleReminders(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* Fast Reminders */}
          <div className="pt-4 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Fast Day Alarms</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Notification at Alot HaShachar (fast begin) and Tzeit HaKochavim (fast end).
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={fastReminders}
                onChange={e => setFastReminders(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* Holiday Reminders */}
          <div className="pt-4 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Holiday & Rosh Chodesh</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Advance briefing 24 hours prior to Rosh Chodesh and major Yom Tovim.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={holidayReminders}
                onChange={e => setHolidayReminders(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-amber-500"></div>
            </label>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={savedSuccess}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all flex items-center gap-2 shadow-md"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Alarms Synchronized!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Save Notification Profile</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
