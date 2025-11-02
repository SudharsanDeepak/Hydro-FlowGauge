package com.hydroflow.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

// App Center imports
import com.microsoft.appcenter.AppCenter;
import com.microsoft.appcenter.analytics.Analytics;
import com.microsoft.appcenter.crashes.Crashes;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Initialize Microsoft App Center
        AppCenter.start(
                getApplication(),
                "4d8a6dbf-fdfc-449f-9765-6c32858245e1",
                Analytics.class,
                Crashes.class
        );
    }
}