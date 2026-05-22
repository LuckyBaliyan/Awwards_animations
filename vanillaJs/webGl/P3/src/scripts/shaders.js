export const vertexShader = /* glsl */
 `
varying vec2 vUv;

void main() {

  vUv = uv;

  gl_Position =
    projectionMatrix *
    modelViewMatrix *
    vec4(position, 1.0);
}
`;

export const fragmentShader = /* glsl */
 `
varying vec2 vUv;

uniform sampler2D uTexCurrent;
uniform sampler2D uTexNext;

uniform float uProgress;

uniform vec2 uResolution;
uniform vec2 uImageRes;

uniform float uWaveFreq;
uniform float uWavePow;
uniform float uWaveWidth;
uniform float uFalloff;
uniform float uBoostStrength;
uniform float uMobile;

/* ------------------------------------------------ */
/* TRUE COVER UV                                    */
/* ------------------------------------------------ */

vec2 coverUV(
    vec2 uv,
    vec2 screenSize,
    vec2 imageSize
) {

    float screenRatio =
        screenSize.x / screenSize.y;

    float imageRatio =
        imageSize.x / imageSize.y;

    vec2 newSize =
        screenRatio < imageRatio
        ? vec2(
            imageSize.x *
            screenSize.y /
            imageSize.y,

            screenSize.y
        )

        : vec2(
            screenSize.x,

            imageSize.y *
            screenSize.x /
            imageSize.x
        );

    vec2 offset =
        screenRatio < imageRatio

        ? vec2(
            (newSize.x - screenSize.x) *
            0.5,

            0.0
        )

        : vec2(
            0.0,

            (newSize.y - screenSize.y) *
            0.5
        );

    return
        uv *
        screenSize /
        newSize +

        offset /
        newSize;
}

void main() {

    vec2 uv = vUv;

    /* ------------------------------------------------ */
    /* COVER UV                                         */
    /* ------------------------------------------------ */

    vec2 uvCover = coverUV(
        uv,
        uResolution,
        uImageRes
    );

    /* ------------------------------------------------ */
    /* RIPPLE SPACE                                     */
    /* ------------------------------------------------ */

    vec2 centeredUV = uv - 0.5;

    centeredUV.x *=
        uResolution.x /
        uResolution.y;

    float dist =
        length(centeredUV);

    float currentTime =
        uProgress;

    vec2 distortedUV =
        uvCover;

    /* ------------------------------------------------ */
    /* RIPPLE DISTORTION                                */
    /* ------------------------------------------------ */

    if (currentTime > 0.0001) {

        float outerEdge =
            currentTime +
            uWaveWidth;

        float innerEdge =
            currentTime -
            uWaveWidth;

        if (
            dist <= outerEdge &&
            dist >= innerEdge
        ) {

            float diff =
                dist -
                currentTime;

            float strength =
                1.0 -
                pow(
                    abs(diff * uWaveFreq),
                    uWavePow
                );

            vec2 dir =
                normalize(centeredUV);

            distortedUV +=
                (
                    dir *
                    diff *
                    strength
                ) /

                (
                    max(currentTime, 0.001) *
                    max(dist, 0.001) *
                    (uFalloff * 0.8)
                );
        }
    }

    /* ------------------------------------------------ */
    /* TEXTURE                                          */
    /* ------------------------------------------------ */

    vec4 color = texture2D(
        uTexCurrent,
        distortedUV
    );

    /* ------------------------------------------------ */
    /* EDGE BOOST                                       */
    /* ------------------------------------------------ */

    if (uMobile < 0.5) {

        float ring = smoothstep(
            uWaveWidth,
            0.0,
            abs(dist - currentTime)
        );

        color.rgb +=
            color.rgb *
            ring *
            uBoostStrength *
            0.15;
    }

    gl_FragColor = color;
}
`;