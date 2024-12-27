import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

interface ActivityOption {
  name: string;
  timeInterval: number; // in minutes
}

export const SKILL_ACTIVITIES = {
  "Technique": [
    { name: "Wrestling practice", timeInterval: 60 },
    { name: "Specific drilling", timeInterval: 30 },
    { name: "Film Study", timeInterval: 20 },
    { name: "Custom", timeInterval: -1 }
  ],
  "Strength": [
    { name: "Strength training", timeInterval: 60 },
    { name: "Custom", timeInterval: -1 }
  ],
  "Endurance": [
    { name: "Run 2 miles", timeInterval: 0 }, // one-off activity
    { name: "HIIT cardio session", timeInterval: 30 },
    { name: "Wrestling conditioning", timeInterval: 60 },
    { name: "Custom", timeInterval: -1 }
  ],
  "Spd/Agility": [
    { name: "Sprint intervals", timeInterval: 0 }, // one-off activity
    { name: "Ladder/agility drills", timeInterval: 20 },
    { name: "Plyometric exercises", timeInterval: 30 },
    { name: "Custom", timeInterval: -1 }
  ],
  "Mindset": [
    { name: "Visualization", timeInterval: 10 },
    { name: "Mindfulness meditation", timeInterval: 10 },
    { name: "Gratitude journal", timeInterval: 10 },
    { name: "Positive self-talk", timeInterval: 10 },
    { name: "Custom", timeInterval: -1 }
  ],
  "Rec/Health": [
    { name: "Ice bath/contrast shower", timeInterval: 0 }, // one-off activity
    { name: "Stretch/foam roll", timeInterval: 15 },
    { name: "1 gallon water intake", timeInterval: 0 }, // one-off activity
    { name: "Meet protein goal", timeInterval: 0 }, // one-off activity
    { name: "Custom", timeInterval: -1 }
  ],
  "Flexibility": [
    { name: "Yoga session", timeInterval: 30 },
    { name: "Static stretching", timeInterval: 15 },
    { name: "Custom", timeInterval: -1 }
  ]
};

interface ActivityLogDialogProps {
  open: boolean;
  onClose: () => void;
  skillName: string;
  onLog: (activity: string, duration: number) => void;
}

export function ActivityLogDialog({ open, onClose, skillName, onLog }: ActivityLogDialogProps) {
  const [selectedActivity, setSelectedActivity] = useState<ActivityOption | null>(null);
  const [duration, setDuration] = useState(0);
  const [customActivityName, setCustomActivityName] = useState("");

  useEffect(() => {
    if (!open) {
      setSelectedActivity(null);
      setDuration(0);
      setCustomActivityName("");
    }
  }, [open, skillName]);

  const activities = SKILL_ACTIVITIES[skillName as keyof typeof SKILL_ACTIVITIES] || [];

  const calculatePoints = (activity: ActivityOption, activityDuration: number) => {
    if (activity.timeInterval === -1) return 1; // Custom activity
    if (activity.timeInterval === 0) return 1;  // One-off activity
    return Math.floor(activityDuration / activity.timeInterval);
  };

  const handleSubmit = () => {
    if (selectedActivity) {
      if (selectedActivity.timeInterval === -1) {
        // For custom activities, use the custom name and no duration
        onLog(customActivityName || "Custom activity", 0);
      } else {
        onLog(selectedActivity.name, duration);
      }
      onClose();
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900/90 border border-gray-800 text-white p-6 rounded-2xl w-[90vw] max-w-md z-50 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Log {skillName} Activity
            </Dialog.Title>
            <Dialog.Close className="rounded-full p-1.5 hover:bg-gray-800 transition-colors">
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-2">
              {activities.map((activity) => (
                <button
                  key={activity.name}
                  onClick={() => {
                    setSelectedActivity(activity);
                    if (activity.timeInterval > 0) {
                      setDuration(activity.timeInterval);
                    }
                    if (activity.timeInterval === -1) {
                      setCustomActivityName("");
                    }
                  }}
                  className={`p-4 rounded-xl text-left transition-all duration-200 ${
                    selectedActivity?.name === activity.name
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20"
                      : "bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-gray-600"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{activity.name}</span>
                    {activity.timeInterval > 0 && (
                      <span className={`text-sm ${
                        selectedActivity?.name === activity.name 
                          ? "text-blue-200" 
                          : "text-gray-400"
                      }`}>
                        {activity.timeInterval} min = 1 point
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {selectedActivity && (
              <div className="space-y-3 bg-gray-800/30 p-4 rounded-xl border border-gray-700">
                {selectedActivity.timeInterval === -1 ? (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Custom Activity Name
                    </label>
                    <input
                      type="text"
                      value={customActivityName}
                      onChange={(e) => setCustomActivityName(e.target.value)}
                      placeholder="Enter activity name"
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <div className="text-sm text-blue-400 font-medium">
                      Points to earn: 1
                    </div>
                  </div>
                ) : selectedActivity.timeInterval > 0 && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Duration
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i} value={selectedActivity.timeInterval * (i + 1)}>
                          {selectedActivity.timeInterval * (i + 1)} minutes
                        </option>
                      ))}
                    </select>
                    <div className="text-sm text-blue-400 font-medium">
                      Points to earn: {calculatePoints(selectedActivity, duration)}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedActivity}
                className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg shadow-blue-500/20"
              >
                Log Activity
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
} 