package com.agendaensaio.app;

import android.graphics.Color;
import android.os.Bundle;
import androidx.core.view.WindowCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onResume() {
        super.onResume();

        // Final, most aggressive attempt to control the status bar.
        // We first tell the system that the app's layout should NOT fit into the system windows (i.e., respect the status bar area).
        WindowCompat.setDecorFitsSystemWindows(getWindow(), true);

        // Then, we explicitly and forcefully set the status bar color to BLACK.
        // This overrides any theme or capacitor setting.
        getWindow().setStatusBarColor(Color.BLACK);
    }
}
