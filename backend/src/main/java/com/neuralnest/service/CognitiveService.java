package com.neuralnest.service;

import org.springframework.stereotype.Service;

@Service
public class CognitiveService {

    public BurnoutAlert predictBurnout(double eyeScore, double totalLoad) {
        boolean imminent = eyeScore > 0.75 && totalLoad > 0.7;
        String timeLeft = imminent
                ? "15min"
                : (totalLoad > 0.6 ? "30min" : "Safe");
        return new BurnoutAlert(imminent, timeLeft);
    }

    public static class BurnoutAlert {
        private boolean imminent;
        private String timeLeft;

        public BurnoutAlert(boolean imminent, String timeLeft) {
            this.imminent = imminent;
            this.timeLeft = timeLeft;
        }

        public boolean isImminent() {
            return imminent;
        }

        public void setImminent(boolean imminent) {
            this.imminent = imminent;
        }

        public String getTimeLeft() {
            return timeLeft;
        }

        public void setTimeLeft(String timeLeft) {
            this.timeLeft = timeLeft;
        }
    }
}
