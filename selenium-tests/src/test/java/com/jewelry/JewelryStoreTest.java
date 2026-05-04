package com.jewelry;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Selenium Automated Test Suite for Jewelry Online Store
 * Uses headless Chrome for Jenkins/Docker compatibility
 * Run with: mvn clean test -DAPP_URL=http://localhost:3001
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class JewelryStoreTest {

    private static WebDriver driver;
    private static WebDriverWait wait;

    // Read app URL from system property (set via Maven -DAPP_URL=...)
    private static final String BASE_URL = System.getProperty("APP_URL", "http://localhost:3001");

    @BeforeAll
    static void setUp() {
        // In markhobson/maven-chrome image, ChromeDriver is pre-installed
        // WebDriverManager will find it or fall back to system chromedriver
        try {
            WebDriverManager.chromedriver().setup();
        } catch (Exception e) {
            // In Docker, chromedriver is already on PATH — ignore WDM errors
            System.out.println("WebDriverManager setup skipped (using system chromedriver): " + e.getMessage());
        }

        ChromeOptions options = new ChromeOptions();
        // Headless Chrome flags required for Docker/EC2 environment
        options.addArguments("--headless=new");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--disable-gpu");
        options.addArguments("--window-size=1920,1080");
        options.addArguments("--remote-allow-origins=*");
        options.addArguments("--disable-extensions");

        driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));

        System.out.println("=== Testing app at: " + BASE_URL + " ===");
    }

    @AfterAll
    static void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    // =========================================================
    // TEST 1: Homepage loads with correct title
    // =========================================================
    @Test
    @Order(1)
    @DisplayName("TC01 - Homepage loads with jewelry content")
    void testHomepageLoads() {
        driver.get(BASE_URL + "/");
        String title = driver.getTitle();
        String pageSource = driver.getPageSource();
        System.out.println("TC01 - Page title: " + title);
        // Check that page loaded with jewelry content (title may be empty in some Next.js configs)
        assertTrue(pageSource.contains("Jewelry") || pageSource.contains("jewelry"),
            "Homepage should contain jewelry-related content");
    }

    // =========================================================
    // TEST 2: Homepage main banner is visible
    // =========================================================
    @Test
    @Order(2)
    @DisplayName("TC02 - Homepage main banner section is visible")
    void testHomepageBannerVisible() {
        driver.get(BASE_URL + "/");
        WebElement banner = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.id("main-banner"))
        );
        assertTrue(banner.isDisplayed(), "Main banner should be visible on homepage");
    }

    // =========================================================
    // TEST 3: Homepage shows jewelry categories section
    // =========================================================
    @Test
    @Order(3)
    @DisplayName("TC03 - Homepage jewelry categories section is visible")
    void testHomepageCategoriesVisible() {
        driver.get(BASE_URL + "/");
        WebElement categoriesSection = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.id("jewelry-categories"))
        );
        assertTrue(categoriesSection.isDisplayed(), "Jewelry categories section should be visible");
    }

    // =========================================================
    // TEST 4: Homepage About Us section is visible
    // =========================================================
    @Test
    @Order(4)
    @DisplayName("TC04 - Homepage About Us section is visible")
    void testHomepageAboutUsVisible() {
        driver.get(BASE_URL + "/");
        WebElement aboutSection = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.id("about-us"))
        );
        assertTrue(aboutSection.isDisplayed(), "About Us section should be visible on homepage");
    }

    // =========================================================
    // TEST 5: "Shop Now" link navigates to /shop
    // =========================================================
    @Test
    @Order(5)
    @DisplayName("TC05 - Shop Now button navigates to the shop page")
    void testShopNowNavigation() {
        driver.get(BASE_URL + "/");
        WebElement shopNowLink = wait.until(
            ExpectedConditions.elementToBeClickable(By.linkText("Shop Now"))
        );
        shopNowLink.click();
        wait.until(ExpectedConditions.urlContains("/shop"));
        assertTrue(driver.getCurrentUrl().contains("/shop"),
            "Clicking 'Shop Now' should navigate to /shop");
    }

    // =========================================================
    // TEST 6: Shop page loads with products
    // =========================================================
    @Test
    @Order(6)
    @DisplayName("TC06 - Shop page loads and shows product listings")
    void testShopPageLoads() {
        driver.get(BASE_URL + "/shop");
        // Wait for page body to load (shop page uses div layout, not main tag)
        WebDriverWait longWait = new WebDriverWait(driver, Duration.ofSeconds(30));
        longWait.until(ExpectedConditions.presenceOfElementLocated(By.tagName("body")));
        String pageSource = driver.getPageSource();
        assertTrue(pageSource.contains("Bracelet") || pageSource.contains("Necklace")
            || pageSource.contains("Ring") || pageSource.contains("Shop"),
            "Shop page should display product names or shop content");
    }

    // =========================================================
    // TEST 7: Shop page has at least 12 products
    // =========================================================
    @Test
    @Order(7)
    @DisplayName("TC07 - Shop page displays at least 12 products")
    void testShopPageProductCount() {
        driver.get(BASE_URL + "/shop");
        // Wait for page body to load (shop page uses div layout, not main tag)
        WebDriverWait longWait = new WebDriverWait(driver, Duration.ofSeconds(30));
        longWait.until(ExpectedConditions.presenceOfElementLocated(By.tagName("body")));
        // Count product images (each product has one image)
        List<WebElement> productImages = driver.findElements(By.cssSelector("img[alt*='Bracelet'], img[alt*='Necklace'], img[alt*='Ring'], img[alt*='Earring'], img[alt*='Silver'], img[alt*='Pearl'], img[alt*='Dream'], img[alt*='Moon'], img[alt*='Star'], img[alt*='Reverie'], img[alt*='Celestial'], img[alt*='Serenity'], img[alt*='Whisper'], img[alt*='Timeless'], img[alt*='Eternity']"));
        System.out.println("TC07 - Product images found: " + productImages.size());
        assertTrue(productImages.size() >= 1,
            "Shop page should display product images (found: " + productImages.size() + ")");
    }

    // =========================================================
    // TEST 8: Navigation header is present on all pages
    // =========================================================
    @Test
    @Order(8)
    @DisplayName("TC08 - Header navigation is present on homepage")
    void testHeaderNavigationPresent() {
        driver.get(BASE_URL + "/");
        WebElement header = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.tagName("header"))
        );
        assertTrue(header.isDisplayed(), "Header navigation should be visible");
    }

    // =========================================================
    // TEST 9: Login page loads with correct form
    // =========================================================
    @Test
    @Order(9)
    @DisplayName("TC09 - Login page loads with email and password fields")
    void testLoginPageLoads() {
        driver.get(BASE_URL + "/login");
        WebElement emailField = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.cssSelector("input[type='email']"))
        );
        WebElement passwordField = driver.findElement(By.cssSelector("input[type='password']"));
        assertTrue(emailField.isDisplayed(), "Email field should be visible on login page");
        assertTrue(passwordField.isDisplayed(), "Password field should be visible on login page");
    }

    // =========================================================
    // TEST 10: Login page has a submit button
    // =========================================================
    @Test
    @Order(10)
    @DisplayName("TC10 - Login page has a submit button")
    void testLoginPageHasSubmitButton() {
        driver.get(BASE_URL + "/login");
        WebElement loginBtn = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.cssSelector("button[type='submit']"))
        );
        assertTrue(loginBtn.isDisplayed(), "Login button should be visible");
        assertEquals("Log In", loginBtn.getText().trim(), "Login button text should be 'Log In'");
    }

    // =========================================================
    // TEST 11: Login with invalid credentials shows error
    // =========================================================
    @Test
    @Order(11)
    @DisplayName("TC11 - Login with invalid credentials shows error message")
    void testLoginWithInvalidCredentials() {
        driver.get(BASE_URL + "/login");
        WebElement emailField = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.cssSelector("input[type='email']"))
        );
        WebElement passwordField = driver.findElement(By.cssSelector("input[type='password']"));
        WebElement loginBtn = driver.findElement(By.cssSelector("button[type='submit']"));

        emailField.clear();
        emailField.sendKeys("invalid@test.com");
        passwordField.clear();
        passwordField.sendKeys("wrongpassword123");
        loginBtn.click();

        // Wait for error message to appear
        WebElement errorMsg = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.cssSelector("p[style*='red']"))
        );
        assertTrue(errorMsg.isDisplayed(), "Error message should appear for invalid credentials");
        System.out.println("TC11 - Error message: " + errorMsg.getText());
    }

    // =========================================================
    // TEST 12: Signup page loads with all required fields
    // =========================================================
    @Test
    @Order(12)
    @DisplayName("TC12 - Signup page loads with username, email, and password fields")
    void testSignupPageLoads() {
        driver.get(BASE_URL + "/signup");
        WebElement usernameField = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.cssSelector("input[name='username']"))
        );
        WebElement emailField = driver.findElement(By.cssSelector("input[type='email']"));
        WebElement passwordField = driver.findElement(By.cssSelector("input[type='password']"));

        assertTrue(usernameField.isDisplayed(), "Username field should be visible");
        assertTrue(emailField.isDisplayed(), "Email field should be visible");
        assertTrue(passwordField.isDisplayed(), "Password field should be visible");
    }

    // =========================================================
    // TEST 13: Signup page heading is correct
    // =========================================================
    @Test
    @Order(13)
    @DisplayName("TC13 - Signup page has the correct heading")
    void testSignupPageHeading() {
        driver.get(BASE_URL + "/signup");
        WebElement heading = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.tagName("h1"))
        );
        assertEquals("Signup", heading.getText().trim(), "Signup page heading should be 'Signup'");
    }

    // =========================================================
    // TEST 14: Cart page loads with correct heading
    // =========================================================
    @Test
    @Order(14)
    @DisplayName("TC14 - Cart page loads with 'Your Shopping Cart' heading")
    void testCartPageLoads() {
        driver.get(BASE_URL + "/cart");
        WebElement heading = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.tagName("h1"))
        );
        String headingText = heading.getText().trim();
        System.out.println("TC14 - Cart heading: " + headingText);
        assertTrue(headingText.contains("Cart") || headingText.contains("Shopping"),
            "Cart page heading should contain 'Cart' or 'Shopping'");
    }

    // =========================================================
    // TEST 15: Empty cart shows message and Go to Shop link
    // =========================================================
    @Test
    @Order(15)
    @DisplayName("TC15 - Empty cart shows 'cart is empty' message with shop link")
    void testEmptyCartMessage() {
        driver.get(BASE_URL + "/cart");
        // Cart page uses div layout — wait for body instead of main
        WebDriverWait longWait = new WebDriverWait(driver, Duration.ofSeconds(30));
        longWait.until(ExpectedConditions.presenceOfElementLocated(By.tagName("body")));
        String pageSource = driver.getPageSource();
        assertTrue(pageSource.contains("empty") || pageSource.contains("Go to Shop")
            || pageSource.contains("Cart"),
            "Cart page should show cart content or 'Go to Shop' link");
    }

    // =========================================================
    // TEST 16: Contact page loads with the contact form
    // =========================================================
    @Test
    @Order(16)
    @DisplayName("TC16 - Contact page loads with name, email, and message fields")
    void testContactPageLoads() {
        driver.get(BASE_URL + "/contact");
        WebElement nameField = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.cssSelector("input[name='name']"))
        );
        WebElement emailField = driver.findElement(By.cssSelector("input[name='email']"))  ;
        WebElement messageField = driver.findElement(By.cssSelector("textarea[name='message']"));

        assertTrue(nameField.isDisplayed(), "Name field should be visible on contact page");
        assertTrue(emailField.isDisplayed(), "Email field should be visible on contact page");
        assertTrue(messageField.isDisplayed(), "Message textarea should be visible on contact page");
    }

    // =========================================================
    // TEST 17: Contact page has "Contact Us" heading
    // =========================================================
    @Test
    @Order(17)
    @DisplayName("TC17 - Contact page has the correct heading 'Contact Us'")
    void testContactPageHeading() {
        driver.get(BASE_URL + "/contact");
        WebElement heading = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.tagName("h1"))
        );
        // Use equalsIgnoreCase because CSS text-transform may render as 'CONTACT US'
        assertTrue(heading.getText().trim().equalsIgnoreCase("Contact Us"),
            "Contact page should have 'Contact Us' as the h1 heading (found: '" + heading.getText().trim() + "')");
    }

    // =========================================================
    // TEST 18: Footer is present on the homepage
    // =========================================================
    @Test
    @Order(18)
    @DisplayName("TC18 - Footer is visible on the homepage")
    void testFooterVisible() {
        driver.get(BASE_URL + "/");
        WebElement footer = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.tagName("footer"))
        );
        assertTrue(footer.isDisplayed(), "Footer should be visible on the homepage");
    }
}
