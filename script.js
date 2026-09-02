const canvas = document.getElementById("fieldCanvas");

if (canvas) {

    const ctx = canvas.getContext("2d");

    const chargeSlider = document.getElementById("charge");

    const chargeValue = document.getElementById("chargeValue");


    let charge = 1;

    let chargeX = 0;

    let chargeY = 0;

    let dragging = false;


    function resizeCanvas() {

        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width;

        canvas.height = rect.height;

        chargeX = canvas.width / 2;

        chargeY = canvas.height / 2;

        draw();

    }


    function draw() {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        /*
         * DRAW FIELD
         */

        const spacing = 45;

        for (
            let x = spacing / 2;
            x < canvas.width;
            x += spacing
        ) {

            for (
                let y = spacing / 2;
                y < canvas.height;
                y += spacing
            ) {

                const dx = chargeX - x;

                const dy = chargeY - y;

                const distance =
                    Math.sqrt(dx * dx + dy * dy);


                if (distance < 35) {
                    continue;
                }


                /*
                 * Direction of the field
                 */

                let directionX = dx / distance;

                let directionY = dy / distance;


                /*
                 * Positive charge:
                 * field points AWAY.
                 *
                 * Negative charge:
                 * field points TOWARD.
                 */

                if (charge > 0) {

                    directionX *= -1;

                    directionY *= -1;

                }


                /*
                 * Field strength
                 */

                const strength =
                    Math.min(
                        Math.abs(charge) * 12000 /
                        (distance * distance),
                        1
                    );


                const length =
                    8 + strength * 18;


                const startX =
                    x - directionX * length / 2;

                const startY =
                    y - directionY * length / 2;


                const endX =
                    x + directionX * length / 2;

                const endY =
                    y + directionY * length / 2;


                /*
                 * Arrow
                 */

                ctx.beginPath();

                ctx.moveTo(startX, startY);

                ctx.lineTo(endX, endY);

                ctx.strokeStyle =
                    `rgba(255,255,255,${0.15 + strength * 0.5})`;

                ctx.lineWidth = 1.5;

                ctx.stroke();


                const arrowSize = 4;


                ctx.beginPath();

                ctx.moveTo(endX, endY);

                ctx.lineTo(
                    endX - directionX * arrowSize
                    - directionY * arrowSize,

                    endY - directionY * arrowSize
                    + directionX * arrowSize
                );

                ctx.lineTo(
                    endX - directionX * arrowSize
                    + directionY * arrowSize,

                    endY - directionY * arrowSize
                    - directionX * arrowSize
                );

                ctx.closePath();

                ctx.fillStyle = "rgba(255,255,255,0.5)";

                ctx.fill();

            }

        }


        /*
         * DRAW CHARGE
         */

        ctx.beginPath();

        ctx.arc(
            chargeX,
            chargeY,
            25,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            charge >= 0 ? "#ffffff" : "#777777";

        ctx.fill();


        /*
         * Charge symbol
         */

        ctx.fillStyle =
            charge >= 0 ? "#000000" : "#ffffff";

        ctx.font = "bold 20px Arial";

        ctx.textAlign = "center";

        ctx.textBaseline = "middle";

        ctx.fillText(
            charge >= 0
                ? "+"
                : "−",

            chargeX,
            chargeY
        );

    }


    /*
     * SLIDER
     */

    chargeSlider.addEventListener(
        "input",
        function () {

            charge = Number(this.value);

            chargeValue.textContent = charge;

            draw();

        }
    );


    /*
     * DRAGGING
     */

    function moveCharge(x, y) {

        const rect =
            canvas.getBoundingClientRect();

        chargeX = x - rect.left;

        chargeY = y - rect.top;

        draw();

    }


    canvas.addEventListener(
        "mousedown",
        function (event) {

            const rect =
                canvas.getBoundingClientRect();

            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;

            const distance =
                Math.sqrt(
                    (x - chargeX) ** 2 +
                    (y - chargeY) ** 2
                );


            if (distance < 40) {

                dragging = true;

            }

        }
    );


    canvas.addEventListener(
        "mousemove",
        function (event) {

            if (!dragging) return;

            moveCharge(
                event.clientX,
                event.clientY
            );

        }
    );


    canvas.addEventListener(
        "mouseup",
        function () {

            dragging = false;

        }
    );


    canvas.addEventListener(
        "mouseleave",
        function () {

            dragging = false;

        }
    );


    /*
     * TOUCH SUPPORT
     */

    canvas.addEventListener(
        "touchstart",
        function (event) {

            const touch = event.touches[0];

            const rect =
                canvas.getBoundingClientRect();

            const x =
                touch.clientX - rect.left;

            const y =
                touch.clientY - rect.top;

            const distance =
                Math.sqrt(
                    (x - chargeX) ** 2 +
                    (y - chargeY) ** 2
                );


            if (distance < 50) {

                dragging = true;

                event.preventDefault();

            }

        },
        { passive: false }
    );


    canvas.addEventListener(
        "touchmove",
        function (event) {

            if (!dragging) return;

            const touch = event.touches[0];

            moveCharge(
                touch.clientX,
                touch.clientY
            );

            event.preventDefault();

        },
        { passive: false }
    );


    canvas.addEventListener(
        "touchend",
        function () {

            dragging = false;

        }
    );


    window.addEventListener(
        "resize",
        resizeCanvas
    );


    resizeCanvas();

            }
/* ELECTRIC FLUX SIMULATION */
// ===============================
// ELECTRIC FLUX SIMULATION
// ===============================

const fluxCanvas = document.getElementById("fluxCanvas");

if (fluxCanvas) {
    const ctx = fluxCanvas.getContext("2d");

    const fieldSlider = document.getElementById("fieldSlider");
    const areaSlider = document.getElementById("areaSlider");
    const angleSlider = document.getElementById("angleSlider");

    const fieldValue = document.getElementById("fieldValue");
    const areaValue = document.getElementById("areaValue");
    const angleValue = document.getElementById("angleValue");
    const fluxValue = document.getElementById("fluxValue");

    function resizeFluxCanvas() {
        const rect = fluxCanvas.getBoundingClientRect();

        fluxCanvas.width = rect.width * window.devicePixelRatio;
        fluxCanvas.height = rect.height * window.devicePixelRatio;

        ctx.setTransform(
            window.devicePixelRatio,
            0,
            0,
            window.devicePixelRatio,
            0,
            0
        );

        drawFlux();
    }

    function drawArrow(x1, y1, x2, y2) {
        const headLength = 8;

        const angle = Math.atan2(y2 - y1, x2 - x1);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(
            x2 - headLength * Math.cos(angle - Math.PI / 6),
            y2 - headLength * Math.sin(angle - Math.PI / 6)
        );

        ctx.lineTo(
            x2 - headLength * Math.cos(angle + Math.PI / 6),
            y2 - headLength * Math.sin(angle + Math.PI / 6)
        );

        ctx.closePath();
        ctx.fill();
    }

    function drawFlux() {

        const width = fluxCanvas.clientWidth;
        const height = fluxCanvas.clientHeight;

        ctx.clearRect(0, 0, width, height);

        // -------------------------
        // Background
        // -------------------------

        ctx.fillStyle = "#050505";
        ctx.fillRect(0, 0, width, height);

        // -------------------------
        // Values
        // -------------------------

        const E = Number(fieldSlider.value);
        const A = Number(areaSlider.value);
        const theta = Number(angleSlider.value);

        const radians = theta * Math.PI / 180;

        const flux = E * A * Math.cos(radians);

        fieldValue.textContent = E + " N/C";
        areaValue.textContent = A + " m²";
        angleValue.textContent = theta + "°";

        fluxValue.textContent = flux.toFixed(2) + " N·m²/C";

        // -------------------------
        // Electric field arrows
        // -------------------------

        ctx.strokeStyle = "#ffffff";
        ctx.fillStyle = "#ffffff";
        ctx.lineWidth = 1.5;

        const spacing = 42;

        for (let y = 35; y < height - 20; y += spacing) {

            for (let x = 15; x < width - 20; x += spacing) {

                drawArrow(
                    x,
                    y,
                    x + 27,
                    y
                );
            }
        }

        // -------------------------
        // Surface
        // -------------------------

        const centerX = width / 2;
        const centerY = height / 2;

        const surfaceWidth = 130 + A * 35;

        const surfaceHeight = 85;

        const angle = radians;

        const dx = Math.cos(angle) * surfaceWidth;
        const dy = Math.sin(angle) * surfaceWidth;

        const x1 = centerX - dx / 2;
        const y1 = centerY - dy / 2;

        const x2 = centerX + dx / 2;
        const y2 = centerY + dy / 2;

        // Surface line

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 5;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // -------------------------
        // Surface normal
        // -------------------------

        const normalLength = 75;

        const normalAngle = angle - Math.PI / 2;

        const nx =
            centerX +
            Math.cos(normalAngle) * normalLength;

        const ny =
            centerY +
            Math.sin(normalAngle) * normalLength;

        ctx.strokeStyle = "#d6d6d6";
        ctx.fillStyle = "#d6d6d6";
        ctx.lineWidth = 3;

        drawArrow(
            centerX,
            centerY,
            nx,
            ny
        );

        // -------------------------
        // Labels
        // -------------------------

        ctx.fillStyle = "#ffffff";
        ctx.font = "15px Arial";

        ctx.fillText(
            "Surface",
            centerX - 28,
            centerY + 35
        );

        ctx.fillStyle = "#d6d6d6";

        ctx.fillText(
            "Normal",
            nx + 8,
            ny
        );

        // -------------------------
        // Angle arc
        // -------------------------

        ctx.strokeStyle = "#c8c8c8";
        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.arc(
            centerX,
            centerY,
            42,
            normalAngle,
            0
        );

        ctx.stroke();

        ctx.fillStyle = "#ffffff";

        ctx.fillText(
            "θ = " + theta + "°",
            centerX + 45,
            centerY - 10
        );
    }

    fieldSlider.addEventListener("input", drawFlux);
    areaSlider.addEventListener("input", drawFlux);
    angleSlider.addEventListener("input", drawFlux);

    window.addEventListener("resize", resizeFluxCanvas);

    resizeFluxCanvas();
            }
