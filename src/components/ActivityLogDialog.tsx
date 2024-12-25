import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

interface ActivityOption {
  name: string;
  timeInterval: number; // in minutes
}

const SKILL_ACTIVITIES = {
  "Technique": [
    { name: "Wrestling practice", timeInterval: 60 },
    { name: "Specific drilling", timeInterval: 30 },
    { name: "Film Study", timeInterval: 20 },
    { name: "Custom", timeInterval: 1 }
  ],
  "Strength": [
    { name: "Strength training", timeInterval: 60 },
    { name: "Custom", timeInterval: 1 }
  ],
  "Endurance": [
    { name: "Run 2 miles", timeInterval: 0 }, // one-off activity
    { name: "HIIT cardio session", timeInterval: 30 },
    { name: "Wrestling conditioning", timeInterval: 60 },
    { name: "Custom", timeInterval: 1 }
  ],
  "Spd/Agility": [
    { name: "Sprint intervals", timeInterval: 0 }, // one-off activity
    { name: "Ladder/agility drills", timeInterval: 20 },
    { name: "Plyometric exercises", timeInterval: 30 },
    { name: "Custom", timeInterval: 1 }
  ],
  "Mindset": [
    { name: "Visualization", timeInterval: 10 },
    { name: "Mindfulness meditation", timeInterval: 10 },
    { name: "Gratitude journal", timeInterval: 10 },
    { name: "Positive self-talk", timeInterval: 10 },
    { name: "Custom", timeInterval: 1 }
  ],
  "Rec/Health": [
    { name: "Ice bath/contrast shower", timeInterval: 0 }, // one-off activity
    { name: "Stretch/foam roll", timeInterval: 15 },
    { name: "1 gallon water intake", timeInterval: 0 }, // one-off activity
    { name: "Meet protein goal", timeInterval: 0 }, // one-off activity
    { name: "Custom", timeInterval: 1 }
  ],
  "Flexibility": [
    { name: "Yoga session", timeInterval: 30 },
    { name: "Static stretching", timeInterval: 15 },
    { name: "Custom", timeInterval: 1 }
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
  const [customDuration, setCustomDuration] = useState(0);

  const activities = SKILL_ACTIVITIES[skillName as keyof typeof SKILL_ACTIVITIES] || [];

  const handleSubmit = () => {
    if (selectedActivity) {
      const finalDuration = selectedActivity.name === "Custom" ? customDuration : duration;
      onLog(selectedActivity.name, finalDuration);
      onClose();
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white p-6 rounded-xl w-[90vw] max-w-md z-50">
          <Dialog.Title className="text-xl font-bold mb-4">
            Log {skillName} Activity
          </Dialog.Title>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              {activities.map((activity) => (
                <button
                  key={activity.name}
                  onClick={() => setSelectedActivity(activity)}
                  className={`p-3 rounded-lg text-left ${
                    selectedActivity?.name === activity.name
                      ? "bg-blue-500"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                >
                  {activity.name}
                </button>
              ))}
            </div>

            {selectedActivity && selectedActivity.timeInterval > 0 && (
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Duration ({selectedActivity.timeInterval} minute intervals)
                </label>
                {selectedActivity.name === "Custom" ? (
                  <input
                    type="number"
                    min="1"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(Number(e.target.value))}
                    className="w-full bg-gray-800 rounded-lg p-2 text-white"
                  />
                ) : (
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full bg-gray-800 rounded-lg p-2"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i} value={selectedActivity.timeInterval * (i + 1)}>
                        {selectedActivity.timeInterval * (i + 1)} minutes
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedActivity}
                className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
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