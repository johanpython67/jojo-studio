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

const fluxCanvas = document.getElementById("fluxCanvas");

if (fluxCanvas) {

    const ctx = fluxCanvas.getContext("2d");


    const fieldSlider =
        document.getElementById("fieldSlider");

    const areaSlider =
        document.getElementById("areaSlider");

    const angleSlider =
        document.getElementById("angleSlider");


    const fieldValue =
        document.getElementById("fieldValue");

    const areaValue =
        document.getElementById("areaValue");

    const angleValue =
        document.getElementById("angleValue");

    const fluxValue =
        document.getElementById("fluxValue");


    let electricField = 5;

    let area = 1;

    let angle = 0;


    function resizeFluxCanvas() {

        const rect =
            fluxCanvas.getBoundingClientRect();

        fluxCanvas.width = rect.width;

        fluxCanvas.height = rect.height;

        drawFlux();

    }


    function drawArrow(x1, y1, x2, y2) {

        const angle =
            Math.atan2(y2 - y1, x2 - x1);

        const size = 8;


        ctx.beginPath();

        ctx.moveTo(x1, y1);

        ctx.lineTo(x2, y2);

        ctx.strokeStyle = "#bdbdbd";

        ctx.lineWidth = 2;

        ctx.stroke();


        ctx.beginPath();

        ctx.moveTo(x2, y2);

        ctx.lineTo(
            x2 - size * Math.cos(angle - Math.PI / 6),
            y2 - size * Math.sin(angle - Math.PI / 6)
        );

        ctx.lineTo(
            x2 - size * Math.cos(angle + Math.PI / 6),
            y2 - size * Math.sin(angle + Math.PI / 6)
        );

        ctx.closePath();

        ctx.fillStyle = "#bdbdbd";

        ctx.fill();

    }


    function drawFlux() {

        ctx.clearRect(
            0,
            0,
            fluxCanvas.width,
            fluxCanvas.height
        );


        const centerX =
            fluxCanvas.width / 2;

        const centerY =
            fluxCanvas.height / 2;


        /*
         * DRAW ELECTRIC FIELD
         */

        const spacing = 60;


        for (
            let y = 70;
            y < fluxCanvas.height - 50;
            y += spacing
        ) {

            drawArrow(
                40,
                y,
                centerX - 120,
                y
            );

            drawArrow(
                centerX + 120,
                y,
                fluxCanvas.width - 40,
                y
            );

        }


        /*
         * SURFACE
         */

        const radians =
            angle * Math.PI / 180;


        const surfaceWidth =
            150 + area * 12;


        const surfaceHeight = 110;


        const x1 =
            centerX -
            Math.cos(radians) * surfaceWidth / 2;


        const y1 =
            centerY -
            Math.sin(radians) * surfaceWidth / 2;


        const x2 =
            centerX +
            Math.cos(radians) * surfaceWidth / 2;


        const y2 =
            centerY +
            Math.sin(radians) * surfaceWidth / 2;


        ctx.beginPath();

        ctx.moveTo(x1, y1);

        ctx.lineTo(x2, y2);

        ctx.strokeStyle = "#ffffff";

        ctx.lineWidth = 5;

        ctx.stroke();


        /*
         * NORMAL VECTOR
         */

        const normalAngle =
            radians + Math.PI / 2;


        const normalLength = 75;


        drawArrow(
            centerX,
            centerY,
            centerX +
            Math.cos(normalAngle) * normalLength,

            centerY +
            Math.sin(normalAngle) * normalLength
        );


        /*
         * SURFACE LABEL
         */

        ctx.fillStyle = "#d6d6d6";

        ctx.font = "14px Arial";

        ctx.textAlign = "center";

        ctx.fillText(
            "Surface",
            centerX,
            centerY + 100
        );


        /*
         * FLUX CALCULATION
         */

        const flux =
            electricField *
            area *
            Math.cos(radians);


        fluxValue.textContent =
            flux.toFixed(2) + " N·m²/C";

    }


    /*
     * FIELD SLIDER
     */

    fieldSlider.addEventListener(
        "input",
        function () {

            electricField =
                Number(this.value);

            fieldValue.textContent =
                electricField;

            drawFlux();

        }
    );


    /*
     * AREA SLIDER
     */

    areaSlider.addEventListener(
        "input",
        function () {

            area =
                Number(this.value);

            areaValue.textContent =
                area;

            drawFlux();

        }
    );


    /*
     * ANGLE SLIDER
     */

    angleSlider.addEventListener(
        "input",
        function () {

            angle =
                Number(this.value);

            angleValue.textContent =
                angle;

            drawFlux();

        }
    );


    window.addEventListener(
        "resize",
        resizeFluxCanvas
    );


    resizeFluxCanvas();

}
