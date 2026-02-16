package com.agendaensaio.app;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Ensure the window does not have the fullscreen flag
        getWindow().clearFlags(android.view.WindowManager.LayoutParams.FLAG_FULLSCREEN);
    }

    @Override
    public void onResume() {
        super.onResume();
        // The "decor" view is the root view of the window, which contains the status bar.
        // By setting these flags to 0, we ensure that the status bar is visible and the app content is laid out normally.
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.R) {
            getWindow().setDecorFitsSystemWindows(true);
        } else {
            getWindow().getDecorView().setSystemUiVisibility(android.view.View.SYSTEM_UI_FLAG_VISIBLE);
        }
    }
}
