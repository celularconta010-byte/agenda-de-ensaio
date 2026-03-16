package com.agendaensaio.app;

import android.os.Bundle;
import androidx.core.view.WindowCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // This single line is the modern and recommended way to handle screen insets.
        // It tells the app to fit its layout within the system windows,
        // automatically handling both the status bar at the top and the navigation bar at the bottom.
        WindowCompat.setDecorFitsSystemWindows(getWindow(), true);
    }
}
