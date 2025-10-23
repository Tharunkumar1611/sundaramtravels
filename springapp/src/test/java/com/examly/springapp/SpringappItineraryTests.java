package com.examly.springapp;

import java.io.File;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = SpringappApplication.class)
@AutoConfigureMockMvc
public class SpringappItineraryTests {

    @Autowired
    private MockMvc mockMvc;

    // === API TESTS ===

    @Test
    void SpringBoot_DevelopCoreAPIsAndBusinessLogic_test_Add_Itinerary_Event() throws Exception {
        String json = "{\"tripName\":\"Goa Trip\",\"eventDate\":\"2025-08-10\",\"eventTitle\":\"Beach Visit\",\"eventTime\":\"10:00\",\"eventLocation\":\"Baga\",\"notes\":\"Wear sunglasses\"}";

        mockMvc.perform(post("/api/itinerary")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void SpringBoot_DevelopCoreAPIsAndBusinessLogic_test_Get_Itinerary_By_TripName() throws Exception {
        mockMvc.perform(get("/api/itinerary/Goa Trip")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    // === DIRECTORY CHECKS ===

    @Test
    void SpringBoot_ProjectAnalysisAndUMLDiagram_test_Controller_Directory_Exists() {
        File dir = new File("src/main/java/com/examly/springapp/controller");
        assertTrue(dir.exists() && dir.isDirectory());
    }

    @Test
    void SpringBoot_ProjectAnalysisAndUMLDiagram_test_Model_Directory_Exists() {
        File dir = new File("src/main/java/com/examly/springapp/model");
        assertTrue(dir.exists() && dir.isDirectory());
    }

    @Test
    void SpringBoot_ProjectAnalysisAndUMLDiagram_test_Repository_Directory_Exists() {
        File dir = new File("src/main/java/com/examly/springapp/repository");
        assertTrue(dir.exists() && dir.isDirectory());
    }

    @Test
    void SpringBoot_ProjectAnalysisAndUMLDiagram_test_Service_Directory_Exists() {
        File dir = new File("src/main/java/com/examly/springapp/service");
        assertTrue(dir.exists() && dir.isDirectory());
    }

    // === FILE CHECKS ===

    @Test
    void SpringBoot_ProjectAnalysisAndUMLDiagram_test_ItineraryController_File_Exists() {
        File file = new File("src/main/java/com/examly/springapp/controller/ItineraryController.java");
        assertTrue(file.exists());
    }

    @Test
    void SpringBoot_DatabaseAndSchemaSetup_test_ItineraryModel_File_Exists() {
        File file = new File("src/main/java/com/examly/springapp/model/ItineraryEvent.java");
        assertTrue(file.exists());
    }

    // === CLASS CHECKS ===

    @Test
    void SpringBoot_ProjectAnalysisAndUMLDiagram_test_ItineraryController_Class_Exists() {
        checkClassExists("com.examly.springapp.controller.ItineraryController");
    }

    @Test
    void SpringBoot_ProjectAnalysisAndUMLDiagram_test_ItineraryRepo_Class_Exists() {
        checkClassExists("com.examly.springapp.repository.ItineraryRepository");
    }

    @Test
    void SpringBoot_ProjectAnalysisAndUMLDiagram_test_ItineraryService_Class_Exists() {
        checkClassExists("com.examly.springapp.service.ItineraryService");
    }

    @Test
    void SpringBoot_DatabaseAndSchemaSetup_test_ItineraryModel_Class_Exists() {
        checkClassExists("com.examly.springapp.model.ItineraryEvent");
    }



    // === UTILITY METHODS ===

    private void checkClassExists(String className) {
        try {
            Class.forName(className);
        } catch (ClassNotFoundException e) {
            fail("Class " + className + " does not exist.");
        }
    }

    private void checkFieldExists(String className, String fieldName) {
        try {
            Class<?> clazz = Class.forName(className);
            clazz.getDeclaredField(fieldName);
        } catch (ClassNotFoundException | NoSuchFieldException e) {
            fail("Field " + fieldName + " not found in " + className);
        }
    }

    private void checkClassImplementsInterface(String className, String interfaceName) {
        try {
            Class<?> clazz = Class.forName(className);
            Class<?> iface = Class.forName(interfaceName);
            assertTrue(iface.isAssignableFrom(clazz));
        } catch (ClassNotFoundException e) {
            fail("Missing class or interface.");
        }
    }
}
