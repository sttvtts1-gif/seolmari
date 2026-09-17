package com.seolmari.solarcalc

import android.app.AlertDialog
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.KeyEvent
import android.webkit.JsResult
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    // TODO: GitHub Pages 등 실제 호스팅 주소가 정해지면 이 값을 그 주소로 바꿔주세요.
    // 카카오 JavaScript 키는 developers.kakao.com 콘솔의 "플랫폼 > Web > 사이트 도메인"에
    // 이 주소의 도메인을 등록해야만 지도가 로드됩니다 (로컬 파일 로드로는 동작하지 않음).
    private val siteUrl = "https://sttvtts1-gif.github.io/seolmari/"

    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            useWideViewPort = true
            loadWithOverviewMode = true
            builtInZoomControls = true
            displayZoomControls = false
            mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
        }

        val siteHost = Uri.parse(siteUrl).host

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                val url = request.url
                return if (url.host == siteHost || url.host == "dapi.kakao.com") {
                    false // 앱(웹뷰) 안에서 계속 로드
                } else {
                    startActivity(Intent(Intent.ACTION_VIEW, url))
                    true // 그 외 외부 링크는 시스템 브라우저로 열기
                }
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onJsAlert(view: WebView, url: String, message: String, result: JsResult): Boolean {
                AlertDialog.Builder(this@MainActivity)
                    .setMessage(message)
                    .setPositiveButton(android.R.string.ok) { _, _ -> result.confirm() }
                    .setCancelable(false)
                    .show()
                return true
            }
        }

        webView.loadUrl(siteUrl)
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack()) {
            webView.goBack()
            return true
        }
        return super.onKeyDown(keyCode, event)
    }
}
