// Avtomatik yaratilgan fayl: scripts/generate-images.mjs. Qo‘lda tahrirlamang.
export const IMAGE_WIDTHS = [480,800,1200] as const;
export const IMAGE_RATIO = { width: 4, height: 3 } as const;
export interface GeneratedImage { file: string; color: string; lqip: string }
export const generatedImages: Record<string, GeneratedImage[]> = {
  "yorug-loft": [
    {
      "file": "yorug-loft-1",
      "color": "#f8e8e8",
      "lqip": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAAAQAgCdASoQAAwAA4BaJQBdgCKTruzasxYAAP7yYU0Q/wVLqYcGtnegKuUVz+0S4i9mgosvofjcEz3BelnCACSuT8jzmgkgAAA="
    },
    {
      "file": "yorug-loft-2",
      "color": "#e8e8d8",
      "lqip": "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAAAQAgCdASoQAAwAA4BaJQBdgCP+yA6bbzoAAP7uIGOwFY/pY8pa0ucprbcR9zUOF5+M29rz1mFSY4MQOG5nhDdAdnkAAA=="
    },
    {
      "file": "yorug-loft-3",
      "color": "#d8c8a8",
      "lqip": "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAAAwAgCdASoQAAwAA4BaJZACdAD1e7QK+G96gAD+8Hosqnx7UlrnC8ph5SBJukBgJGkzlFrS8Eur9uBMSfHOI+BO/XkygBhCSbdIhyAA"
    }
  ],
  "siklorama": [
    {
      "file": "siklorama-1",
      "color": "#f8f8f8",
      "lqip": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADwAQCdASoQAAwAA4BaJaQAAveHtVI/mAAA/vJleEkwN1llYAdTZILNAGUIZraR/5dVEaVxC8C3JnglH2K20TSYkz4hdcAA"
    },
    {
      "file": "siklorama-2",
      "color": "#e8e8e8",
      "lqip": "data:image/webp;base64,UklGRm4AAABXRUJQVlA4IGIAAACwAQCdASoQAAwAA4BaJaACdAELU7gAAP7hwn3V/+SyigtqBLKX2Jwin/+PEOEGKQIRTW+ZoQZJKX0ydOfEaM13fJrBI8sLSPZH6dyQrfYNmOoM9GPeWP5dBK39TYs30gAAAA=="
    },
    {
      "file": "siklorama-3",
      "color": "#e8e8e8",
      "lqip": "data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAACwAQCdASoQAAwAA4BaJZQAAp/Vsu/AAP7wnnSeWQwVBky20pz6h0l76f59bWXETJ92Hk78sAAAAA=="
    }
  ],
  "kadr-sahna": [
    {
      "file": "kadr-sahna-1",
      "color": "#282828",
      "lqip": "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAADQAQCdASoQAAwAA4BaJbACdAEO95tK4AD+7SDntINNVNc45Q+SR/UT+DP44O8i9AEczClt5jxz/tdV50ik8LuNEfQU7WrqQ+rpFB37SjbRxsjlVEkngAAA"
    },
    {
      "file": "kadr-sahna-2",
      "color": "#181818",
      "lqip": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAADwAQCdASoQAAwAA4BaJZgCdAEN3H8nlgAA/vG01hsbUOQcw2guZtjzdqHILHjCyawUNSW/GehzRS8R02yfnPjlr33F/LgAAAA="
    },
    {
      "file": "kadr-sahna-3",
      "color": "#282828",
      "lqip": "data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAAAQAgCdASoQAAwAA4BaJbACdAEOzr5AR2GAAP7dwGukrOCFAObE2KtCHKuzKjFkNceW53NUHQqsH8UQNA5AJmFbHQqsaE60I5pn7sMncWPX3enIJpbpmXpZp8ZSuRlAAAA="
    }
  ],
  "neon-box": [
    {
      "file": "neon-box-1",
      "color": "#281848",
      "lqip": "data:image/webp;base64,UklGRj4AAABXRUJQVlA4IDIAAABQAQCdASoQAAwAA4BaJQBdgCgAAP7w/N9lO08SYCO9mbuN5KZbd2qfIpB0GWp6YkAAAA=="
    },
    {
      "file": "neon-box-2",
      "color": "#080818",
      "lqip": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAADwAQCdASoQAAwAA4BaJZACdAEN3A//BAAA/vTAIPCXsZOabSv53Y3zOyzuyXIWbDnr9g4TkDBmVfbF+pCPvTU62WodUwDngAA="
    },
    {
      "file": "neon-box-3",
      "color": "#181828",
      "lqip": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADwAQCdASoQAAwAA4BaJYwCdAEQFENurMAA/varocUJJCGSy4La+TEAWjhCZDLCVzlbe7Cfw6pdRGLoh/fKECaIvKcchXwA"
    }
  ],
  "sado-podkast": [
    {
      "file": "sado-podkast-1",
      "color": "#181828",
      "lqip": "data:image/webp;base64,UklGRnQAAABXRUJQVlA4WAoAAAAQAAAADwAACwAAQUxQSBMAAAABD9D/iAiIBZNd+VunENH/tAEAAFZQOCA6AAAAEAIAnQEqEAAMAAOAWiWUAuwBEBRigtDIAAD+8zYY0enPZqEgSpXB/396wn9J1hbd9DQRllEnUgAAAA=="
    },
    {
      "file": "sado-podkast-2",
      "color": "#282838",
      "lqip": "data:image/webp;base64,UklGRj4AAABXRUJQVlA4IDIAAADQAQCdASoQAAwAA4BaJQBdgCFrrCoCAAD+6+/E9olfT0Sy4Ki3yqqO1A/0XW826AAAAA=="
    },
    {
      "file": "sado-podkast-3",
      "color": "#181818",
      "lqip": "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAAAwAgCdASoQAAwAA4BaJZwC7AEPh9SsoCY0QAD+76Iz16+MQGYYKX+ygKuKj9B+V4rGc3ggsCWzR77bDn/U9OZ22EJu0fcqualgciQe4r614AAA"
    }
  ],
  "suhbat-xonasi": [
    {
      "file": "suhbat-xonasi-1",
      "color": "#281818",
      "lqip": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAACwAQCdASoQAAwAA4BaJQBOgCG6308YAP7zOAPCoJjb39xDu4okHEAqq7UZLIRCpajQGdPPsbiPPRs/8vO62x03FSGchiMZAAA="
    },
    {
      "file": "suhbat-xonasi-2",
      "color": "#584838",
      "lqip": "data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAADQAQCdASoQAAwAA4BaJYwCdAEO/FwRQAD+8aZ9RaXCTzz2441U8m6SKmtLau+NyqXs4qeUpRGSWAAA"
    },
    {
      "file": "suhbat-xonasi-3",
      "color": "#181818",
      "lqip": "data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAADQAQCdASoQAAwAA4BaJYwCdAEO/htGwAD+9LT1O1kvk7kbNiQ/mycHvZl+T6VPjLRnUHkyY/7z5AAA"
    }
  ]
};
