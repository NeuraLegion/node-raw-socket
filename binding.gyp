{
  "variables": {
    "android_ndk_path": ""
  },
  "targets": [
    {
      "target_name": "raw_socket",
      "sources": [
        "src/raw.cc"
      ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
      ],
      "cflags_cc": [
        "-std=c++20"
      ],
      "conditions": [
        [
          "OS==\"mac\"",
          {
            "xcode_settings": {
              "MACOSX_DEPLOYMENT_TARGET": "14.0",
              "CLANG_CXX_LANGUAGE_STANDARD": "c++20",
              "GCC_ENABLE_CPP_EXCEPTIONS": "YES"
            }
          }
        ],
        [
          "OS==\"win\"",
          {
            "libraries": [
              "ws2_32.lib"
            ],
            "msvs_settings": {
              "VCCLCompilerTool": {
                "AdditionalOptions": ["/std:c++20"]
              }
            }
          }
        ]
      ]
    }
  ]
}
